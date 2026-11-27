(function () {
    'use strict';

    const model = window.CausalTablet;
    const byId = id => document.getElementById(id);
    const svgNS = 'http://www.w3.org/2000/svg';
    const ui = Object.fromEntries([
        'exercise-tabs', 'exercise-panel', 'exercise-title',
        'exercise-description', 'first-steps',
        'reset-buttons', 'board', 'connections', 'edge-layer', 'draft-edge',
        'nodes',
        'clear-edges', 'check-edges', 'feedback', 'announcement',
        'game-hud', 'open-help', 'close-help', 'help-panel',
        'close-result', 'result-panel', 'expand-help', 'help-content',
        'timed-controls', 'exercise-timer', 'challenge-date', 'random-controls', 'new-graph',
        'language-toggle', 'back-link'
    ].map(id => [id, byId(id)]));

    // Texts live in tablette-translations.js. The language was chosen before the
    // first paint by the inline script of tablette.html (address, saved choice,
    // then browser language); the toggle switches it without reloading.
    const texts = typeof tabletteTexts !== 'undefined' ? tabletteTexts : { fr: {}, en: {} };
    if (typeof tabletteTexts === 'undefined') {
        console.error('tablette-translations.js n’a pas pu être chargé (erreur dans le fichier ?) : la page garde ses textes français.');
    }
    let language = document.documentElement.lang === 'en' ? 'en' : 'fr';

    // Text of a key in the current language (French if missing), or null if the key is unknown:
    // for instance when tablette-translations.js could not be loaded (typing error in the file).
    function lookup(key) {
        return texts[language]?.[key] ?? texts.fr?.[key] ?? null;
    }

    // Text of a key; {name} is replaced by params.name. An unknown key is shown as is.
    function t(key, params = {}) {
        return (lookup(key) ?? key).replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
    }

    function exerciseText(exercise, field) {
        return t(`exercise-${exercise.id}-${field}`, { size: exercise.nodes.length });
    }

    // The daily seed is the Paris calendar day, YYYYMMDD.
    function challengeDate(seed) {
        const value = String(seed);
        const [year, month, day] = [value.slice(0, 4), value.slice(4, 6), value.slice(6, 8)];
        if (language === 'fr') return `${day}/${month}/${year}`;
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
            .format(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }

    // Fixed texts of tablette.html: data-i18n (content, may hold HTML) and
    // data-i18n-aria-label / -title / -content (attributes). A text missing from the
    // translations leaves the French written in tablette.html in place.
    function translateStaticTexts() {
        document.documentElement.lang = language;
        document.title = lookup('page-title') ?? document.title;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const text = lookup(element.dataset.i18n);
            if (text !== null) element.innerHTML = text;
        });
        for (const attribute of ['aria-label', 'title', 'content']) {
            document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
                const text = lookup(element.getAttribute(`data-i18n-${attribute}`));
                if (text !== null) element.setAttribute(attribute, text);
            });
        }
        // The toggle names the other language, in that language.
        const other = language === 'fr' ? 'en' : 'fr';
        const toggle = ui['language-toggle'];
        toggle.textContent = other.toUpperCase();
        toggle.lang = other;
        toggle.setAttribute('aria-label', texts[other]?.['language-switch'] ?? other);
        toggle.title = toggle.getAttribute('aria-label');
        ui['back-link'].href = `index.html?lang=${language}`;
    }

    // The address names the language, so a copied link opens the same version.
    function showLanguageInUrl() {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', language);
            if (url.href !== window.location.href) history.replaceState(history.state, '', url.href);
        } catch {
            // Address not writable (file opened directly): no consequence.
        }
    }

    // Only the true causal model affects the lights. A learner's arrows never do.
    const exercises = [...model.exercises];
    const freshSession = exercise => restoreDailyResult(exercise, { states: model.createNodeStates(exercise), edges: [],
        feedback: null, elapsed: 0, startedAt: null, dailyStartedAt: null });
    const sessions = new Map(exercises.map(exercise => [exercise.id, freshSession(exercise)]));
    const nodeElements = new Map();
    const tabElements = new Map();
    const clickTimers = new Map();
    const showGuidance = shouldShowGuidance();
    const discovered = { help: false, intervention: false, value: false, arrow: false };
    let gestureNotice = '';
    let activeExercise = exercises[0];
    let drag = null;
    let ignoreClickUntil = 0;
    let resizeFrame = 0;
    const sideHelp = window.matchMedia('(min-width: 1000px)');

    function session() { return sessions.get(activeExercise.id); }
    function announce(message) { ui.announcement.textContent = message; }

    function shouldShowGuidance() {
        const key = 'tablette.lastVisit';
        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;
        try {
            const lastVisit = Number(localStorage.getItem(key));
            localStorage.setItem(key, String(now));
            return !Number.isSafeInteger(lastVisit) || lastVisit <= 0 || lastVisit > now || now - lastVisit >= week;
        } catch {
            return true;
        }
    }

    function pauseClock() {
        const current = session();
        if (current.startedAt !== null) current.elapsed += performance.now() - current.startedAt;
        current.startedAt = null;
    }

    function dailyStart(seed, now = null) {
        const key = `tablette.daily.startedAt.${seed}`;
        try {
            const saved = Number(localStorage.getItem(key));
            if (Number.isSafeInteger(saved) && saved > 0) return saved;
            if (now !== null) localStorage.setItem(key, String(now));
        } catch {
            // Keep the clock running in memory when storage is unavailable.
        }
        return now;
    }

    // A solved daily challenge stays solved until the next day, even after a
    // reload: its final time and arrows are stored with its start time.
    // (Function declarations: the sessions created above already need them.)
    function dailyResultKey(seed) { return `tablette.daily.result.${seed}`; }

    function restoreDailyResult(exercise, current) {
        if (exercise.id !== 'daily') return current;
        try {
            const saved = JSON.parse(localStorage.getItem(dailyResultKey(exercise.seed)));
            if (!saved || !Number.isFinite(saved.elapsed) || saved.elapsed < 0 || !Array.isArray(saved.edges)) return current;
            const edges = saved.edges
                .map(edge => ({ from: Number(edge?.from), to: Number(edge?.to) }))
                .filter(edge => edge.from !== edge.to && exercise.nodes.includes(edge.from) && exercise.nodes.includes(edge.to));
            // Only a genuine solution of today's graph is restored.
            const feedback = model.checkEdges(exercise, edges);
            if (feedback.correct) Object.assign(current, { edges, feedback, elapsed: saved.elapsed });
        } catch {
            // Unreadable or unavailable storage: the challenge starts normally.
        }
        return current;
    }

    function saveDailyResult() {
        const current = session();
        if (activeExercise.id !== 'daily' || !current.feedback?.correct) return;
        try {
            // Keep the first success of the day, as the first start is kept.
            const key = dailyResultKey(activeExercise.seed);
            if (localStorage.getItem(key) === null) {
                localStorage.setItem(key, JSON.stringify({ elapsed: current.elapsed, edges: current.edges }));
            }
        } catch {
            // Without storage, the result stays visible until the page is closed.
        }
    }

    // Past challenges are never shown again: forget their start times and results.
    function forgetPastDailies() {
        const today = model.daySeed();
        try {
            for (let index = localStorage.length - 1; index >= 0; index--) {
                const match = /^tablette\.daily\.(?:startedAt|result)\.(\d{8})$/.exec(localStorage.key(index) || '');
                if (match && Number(match[1]) < today) localStorage.removeItem(match[0]);
            }
        } catch {
            // Storage unavailable: nothing to clean.
        }
    }

    function startDailyClock() {
        if (activeExercise.id !== 'daily' || session().dailyStartedAt !== null) return;
        session().dailyStartedAt = dailyStart(activeExercise.seed, Date.now());
        syncClock();
    }

    function syncClock() {
        const current = session();
        if (activeExercise.id === 'daily') {
            if (current.dailyStartedAt !== null && !current.feedback?.correct) {
                current.elapsed = Math.max(current.elapsed, Date.now() - current.dailyStartedAt);
            }
        } else if (activeExercise.timed && !document.hidden && !current.feedback?.correct) {
            if (current.startedAt === null) current.startedAt = performance.now();
        } else pauseClock();
        const elapsed = current.elapsed + (current.startedAt === null ? 0 : performance.now() - current.startedAt);
        const seconds = Math.floor(elapsed / 1000);
        ui['exercise-timer'].textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        ui['exercise-timer'].setAttribute('aria-label', t(current.feedback?.correct ? 'timer-final' : 'timer-running'));
    }

    function replaceExercise(exercise) {
        const index = exercises.findIndex(item => item.id === exercise.id);
        exercises[index] = exercise;
        sessions.set(exercise.id, freshSession(exercise));
        return exercise;
    }

    function cancelClicks() {
        clickTimers.forEach(timer => clearTimeout(timer));
        clickTimers.clear();
    }

    function cancelDraft() {
        const light = drag && nodeElements.get(drag.from)?.light;
        if (light?.hasPointerCapture(drag.pointerId)) light.releasePointerCapture(drag.pointerId);
        ui.board.classList.remove('is-dragging');
        nodeElements.forEach(({ light }) => light.classList.remove('is-drop-target'));
        drag = null;
        ui['draft-edge'].setAttribute('hidden', '');
    }

    function createTabs() {
        exercises.forEach(exercise => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'exercise-tab';
            button.id = `tab-${exercise.id}`;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', 'exercise-panel');
            const label = document.createElement('span');
            label.className = 'tab-label';
            const done = document.createElement('span');
            done.className = 'tab-done';
            done.textContent = '✓';
            done.setAttribute('aria-hidden', 'true');
            button.append(label, done);
            button.addEventListener('click', () => selectExercise(exercises.find(item => item.id === exercise.id)));
            tabElements.set(exercise.id, button);
            ui['exercise-tabs'].append(button);
        });
    }

    function renderTabs() {
        exercises.forEach((exercise, index) => {
            const button = tabElements.get(exercise.id);
            const selected = exercise === activeExercise;
            const solved = sessions.get(exercise.id).feedback?.correct === true;
            const label = exerciseText(exercise, 'label');
            button.setAttribute('aria-selected', String(selected));
            button.querySelector('.tab-label').textContent = label;
            button.setAttribute('aria-label', t('tab-label', { number: index + 1, label, count: exercise.nodes.length })
                + (solved ? t('tab-solved') : ''));
            button.querySelector('.tab-done').hidden = !solved;
        });
    }

    function positions(exercise, width = 100, height = 100) {
        if (exercise.id === 'reseau') {
            // A neutral, fixed arrangement; never infer positions from edges.
            return { 0: [27, 17], 6: [73, 17], 14: [17, 50], 4: [50, 50], 13: [83, 50], 5: [27, 83], 12: [73, 83] };
        }
        if (exercise.nodes.length === 7) {
            const points = [[27, 17], [73, 17], [17, 50], [50, 50], [83, 50], [27, 83], [73, 83]];
            return Object.fromEntries(exercise.nodes.map((id, index) => [id, points[index]]));
        }
        if (exercise.nodes.length > 9) {
            const rows = Math.ceil(exercise.nodes.length / 3);
            return Object.fromEntries(exercise.nodes.map((id, index) => {
                const row = Math.floor(index / 3);
                const offset = row % 2 === 0 ? -4 : 4;
                return [id, [21 + 29 * (index % 3) + offset, 100 * (row + .5) / rows]];
            }));
        }
        if (exercise.nodes.length === 9) {
            // An odd ring leaves the centre free, without aligning three buttons.
            // On desktop, size a 3:2 ellipse from the width and scale both radii
            // together if height is limited. Keep the existing mobile proportions.
            const radiusX = sideHelp.matches ? Math.min(width * .4, height * .6) : width * .4;
            const radiusY = sideHelp.matches ? radiusX / 1.5 : height * .4;
            const angles = exercise.nodes.map((_, index) => -Math.PI / 2 + index * 2 * Math.PI / exercise.nodes.length);
            if (sideHelp.matches) {
                // Equal arc lengths keep the desktop spacing even on a wide ellipse.
                const steps = 720;
                const lengths = [0];
                let previous = { x: 0, y: -radiusY };
                for (let step = 1; step <= steps; step++) {
                    const angle = -Math.PI / 2 + step * 2 * Math.PI / steps;
                    const point = { x: radiusX * Math.cos(angle), y: radiusY * Math.sin(angle) };
                    lengths.push(lengths.at(-1) + Math.hypot(point.x - previous.x, point.y - previous.y));
                    previous = point;
                }
                let step = 1;
                angles.forEach((_, index) => {
                    const target = lengths.at(-1) * index / angles.length;
                    while (lengths[step] < target) step++;
                    const fraction = (target - lengths[step - 1]) / (lengths[step] - lengths[step - 1]);
                    angles[index] = -Math.PI / 2 + (step - 1 + fraction) * 2 * Math.PI / steps;
                });
            }
            return Object.fromEntries(exercise.nodes.map((id, index) => {
                const angle = angles[index];
                return [id, [width / 2 + radiusX * Math.cos(angle), height / 2 + radiusY * Math.sin(angle)]];
            }));
        }
        const points = exercise.nodes.length === 2 ? [[30, 50], [70, 50]] : [[50, 25], [24, 75], [76, 75]];
        return Object.fromEntries(exercise.nodes.map((id, index) => [id, points[index]]));
    }

    function createNodes() {
        ui.nodes.replaceChildren();
        ui.nodes.dataset.count = activeExercise.nodes.length;
        nodeElements.clear();
        const layout = positions(activeExercise);
        activeExercise.nodes.forEach(id => {
            const node = document.createElement('div');
            node.className = 'tablet-node';
            node.dataset.node = id;
            node.style.left = `${layout[id][0]}%`;
            node.style.top = `${layout[id][1]}%`;
            const light = document.createElement('button');
            light.type = 'button';
            light.className = 'node-light';
            light.dataset.node = id;
            light.innerHTML = '<svg class="intervention-symbol" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
            light.addEventListener('click', event => handleLightClick(event, id));
            light.addEventListener('pointerdown', event => beginDrag(event, id));
            node.append(light);
            nodeElements.set(id, { node, light });
            ui.nodes.append(node);
        });
    }

    function selectExercise(exercise) {
        pauseClock();
        if (exercise.id === 'daily' && exercise.seed !== model.daySeed()) exercise = replaceExercise(model.createDailyExercise());
        cancelClicks();
        cancelDraft();
        activeExercise = exercise;
        if (exercise.id === 'daily' && session().dailyStartedAt === null) {
            session().dailyStartedAt = dailyStart(exercise.seed);
        }
        ui['timed-controls'].hidden = !exercise.timed;
        ui['challenge-date'].hidden = exercise.id !== 'daily';
        ui['random-controls'].hidden = exercise.id !== 'random';
        syncClock();
        ui['result-panel'].hidden = true;
        ui.board.dataset.exercise = exercise.id;
        ui['exercise-panel'].setAttribute('aria-labelledby', `tab-${exercise.id}`);
        renderExerciseTexts();
        gestureNotice = '';
        renderTabs();
        createNodes();
        renderStates();
        renderGuidance();
        layoutBoard();
        renderEdges();
        announce(t('announce-exercise', { number: exercises.indexOf(exercise) + 1,
            label: exerciseText(exercise, 'label'), count: exercise.nodes.length }));
    }

    // Texts that depend on the active exercise (re-rendered on a language change).
    function renderExerciseTexts() {
        ui['challenge-date'].textContent = activeExercise.id === 'daily'
            ? t('challenge-date', { date: challengeDate(activeExercise.seed) }) : '';
        ui['exercise-title'].textContent = exerciseText(activeExercise, 'title');
        ui['exercise-description'].textContent = exerciseText(activeExercise, 'description');
    }

    function renderStates() {
        const current = session();
        activeExercise.nodes.forEach(id => {
            const state = current.states[id];
            const element = nodeElements.get(id);
            element.light.classList.toggle('is-on', state.isOn);
            element.light.classList.toggle('is-intervention', state.isInterv);
            element.light.setAttribute('aria-pressed', String(state.isOn));
            element.light.setAttribute('aria-label', t('light-label', { id,
                mode: t(state.isInterv ? 'mode-intervention' : 'mode-natural'), value: t(state.isOn ? 'value-on' : 'value-off') }));
            element.light.title = t('light-title');
        });
    }

    function renderGuidance() {
        let step = 'done';
        let message = '';
        const hasIntervention = activeExercise.nodes.some(id => session().states[id].isInterv);
        if (!discovered.help) {
            step = 'help';
            message = 'guide-help';
        } else if (!discovered.intervention || (!discovered.value && !hasIntervention)) {
            step = 'intervention';
            message = 'guide-intervention';
        } else if (!discovered.value) {
            step = 'value';
            message = 'guide-value';
        } else if (!discovered.arrow) {
            step = 'arrow';
            message = 'guide-arrow';
        }
        const hint = ui['first-steps'];
        hint.dataset.step = showGuidance ? step : 'done';
        // gestureNotice and message are keys, translated at display time.
        const key = gestureNotice || message;
        hint.textContent = showGuidance && key ? t(key) : '';
        hint.hidden = !hint.textContent;
        scheduleConnections();
    }

    function changeIntervention(id) {
        clearTimeout(clickTimers.get(id));
        clickTimers.delete(id);
        session().states = model.toggleIntervention(activeExercise, session().states, id);
        if (session().states[id].isInterv) discovered.intervention = true;
        gestureNotice = '';
        renderStates();
        renderGuidance();
        announceStates(t(session().states[id].isInterv ? 'announce-intervention' : 'announce-natural', { id }));
    }

    function changeValue(id) {
        if (!session().states[id].isInterv) {
            gestureNotice = 'notice-natural';
            renderGuidance();
            const status = t('announce-still-natural', { id });
            announce(showGuidance ? `${status} ${t('announce-still-natural-hint')}` : status);
            return;
        }
        session().states = model.toggleValue(activeExercise, session().states, id);
        discovered.value = true;
        gestureNotice = '';
        renderStates();
        renderGuidance();
        announceStates(t('announce-value', { id }));
    }

    function announceStates(prefix) {
        const values = activeExercise.nodes.map(id => {
            const state = session().states[id];
            return t(state.isInterv ? 'announce-state-intervention' : 'announce-state',
                { id, value: t(state.isOn ? 'value-on' : 'value-off') });
        });
        announce(`${prefix} ${values.join('. ')}.`);
    }

    function handleLightClick(event, id) {
        if (event.detail !== 0 && performance.now() < ignoreClickUntil) return;
        startDailyClock();
        // Keyboard and assistive-technology clicks need no double-click delay.
        if (event.detail === 0) { changeValue(id); return; }
        // Count taps ourselves: touch devices do not consistently emit dblclick.
        if (clickTimers.has(id)) {
            clearTimeout(clickTimers.get(id));
            clickTimers.delete(id);
            changeIntervention(id);
            return;
        }
        clickTimers.set(id, setTimeout(() => {
            clickTimers.delete(id);
            changeValue(id);
        }, 350));
    }

    function beginDrag(event, id) {
        if (drag || event.button !== 0 || event.isPrimary === false) return;
        startDailyClock();
        drag = { from: id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
        if (event.isTrusted) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
    }

    function boardPoint(clientX, clientY) {
        const bounds = ui.board.getBoundingClientRect();
        return { x: clientX - bounds.left, y: clientY - bounds.top };
    }

    function center(id) {
        const bounds = nodeElements.get(id).light.getBoundingClientRect();
        const point = boardPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        return { ...point, radius: bounds.width / 2 + 8 };
    }

    function pathBetween(from, to, bend = 0) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = dx / distance;
        const ny = dy / distance;
        const start = { x: from.x + nx * from.radius, y: from.y + ny * from.radius };
        const end = { x: to.x - nx * (to.radius || 0), y: to.y - ny * (to.radius || 0) };
        if (!bend) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        const cx = (start.x + end.x) / 2 - ny * bend;
        const cy = (start.y + end.y) / 2 + nx * bend;
        return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
    }

    function routingGeometry() {
        const board = ui.board.getBoundingClientRect();
        const area = ui.nodes.getBoundingClientRect();
        const lights = new Map();
        const obstacles = [];
        nodeElements.forEach(({ light }, id) => {
            const rect = light.getBoundingClientRect();
            const point = { x: rect.left + rect.width / 2 - board.left,
                y: rect.top + rect.height / 2 - board.top, radius: rect.width / 2 + 3 };
            lights.set(id, point);
            obstacles.push({ ...point, radius: rect.width / 2 + 2 });
        });
        // Keep some of the 18px margin to the floating controls available for
        // curves around the outermost lights.
        return { lights, obstacles, bounds: { left: area.left - board.left + 4, right: area.right - board.left - 4,
            top: area.top - board.top - 10, bottom: area.bottom - board.top + 10 } };
    }

    function insideObstacle(point, obstacle) {
        return obstacle.radius !== undefined
            ? Math.hypot(point.x - obstacle.x, point.y - obstacle.y) < obstacle.radius
            : point.x > obstacle.left && point.x < obstacle.right && point.y > obstacle.top && point.y < obstacle.bottom;
    }

    function insideRoutingBounds(point, geometry) {
        const lane = geometry.lane;
        return insideObstacle(point, geometry.bounds) && (!lane ||
            lane.dx * (point.y - lane.y) - lane.dy * (point.x - lane.x) >= -.01);
    }

    function curvedRoute(from, to, control) {
        // Keep a usable tangent at both ends: a control point too near the
        // attachment circle makes the curve double back beside the arrowhead.
        if (control && [from, to].some(point => Math.hypot(control.x - point.x, control.y - point.y) < point.radius + 16)) return null;
        if (!control && Math.hypot(to.x - from.x, to.y - from.y) <= from.radius + to.radius) return null;
        const endpoint = (point, toward) => {
            const distance = Math.hypot(toward.x - point.x, toward.y - point.y) || 1;
            return { x: point.x + (toward.x - point.x) / distance * point.radius,
                y: point.y + (toward.y - point.y) / distance * point.radius };
        };
        // Attach along the curve's tangent so the arrowhead stays outside the light.
        const start = endpoint(from, control || to);
        const end = endpoint(to, control || from);
        const points = [];
        const steps = Math.max(64, Math.min(160, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 6)));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const u = 1 - t;
            points.push(control
                ? { x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
                    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y }
                : { x: start.x * u + end.x * t, y: start.y * u + end.y * t });
        }
        return { points, d: `M ${start.x} ${start.y} ${control
            ? `Q ${control.x} ${control.y} ${end.x} ${end.y}` : `L ${end.x} ${end.y}`}` };
    }

    function clearSegment(a, b, geometry) {
        if (![a, b].every(point => insideRoutingBounds(point, geometry))) return false;
        const dx = b.x - a.x, dy = b.y - a.y;
        return geometry.obstacles.every(obstacle => {
            if (obstacle.radius !== undefined) {
                const t = Math.max(0, Math.min(1, ((obstacle.x - a.x) * dx + (obstacle.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
                return Math.hypot(a.x + t * dx - obstacle.x, a.y + t * dy - obstacle.y) >= obstacle.radius;
            }
            let lower = 0, upper = 1;
            for (const [position, delta, min, max] of [[a.x, dx, obstacle.left, obstacle.right], [a.y, dy, obstacle.top, obstacle.bottom]]) {
                if (Math.abs(delta) < .001) {
                    if (position <= min || position >= max) return true;
                } else {
                    const entry = (min - position) / delta, exit = (max - position) / delta;
                    lower = Math.max(lower, Math.min(entry, exit));
                    upper = Math.min(upper, Math.max(entry, exit));
                    if (lower >= upper) return true;
                }
            }
            return false;
        });
    }

    function detourRoute(from, to, geometry) {
        // Fallback for narrow passages: join visible obstacle corners, then round
        // the bends. This is deliberately local, not a general graph-layout solver.
        const ports = point => Array.from({ length: 16 }, (_, i) => {
            const angle = i * Math.PI / 8;
            const at = radius => ({ x: point.x + Math.cos(angle) * radius, y: point.y + Math.sin(angle) * radius });
            return { ...at(point.radius + 14), inner: at(point.radius) };
        }).filter(port => clearSegment(port.inner, port, geometry));
        const starts = ports(from), ends = ports(to);
        if (!starts.length || !ends.length) return null;
        const corners = geometry.obstacles.flatMap(obstacle => {
            const left = obstacle.left ?? obstacle.x - obstacle.radius;
            const right = obstacle.right ?? obstacle.x + obstacle.radius;
            const top = obstacle.top ?? obstacle.y - obstacle.radius;
            const bottom = obstacle.bottom ?? obstacle.y + obstacle.radius;
            return [{ x: left - 3, y: top - 3 }, { x: right + 3, y: top - 3 },
                { x: left - 3, y: bottom + 3 }, { x: right + 3, y: bottom + 3 }];
        }).filter(point => insideRoutingBounds(point, geometry) && !geometry.obstacles.some(obstacle => insideObstacle(point, obstacle)));
        const points = [...starts, ...ends, ...corners];
        const costs = points.map((_, i) => i < starts.length ? 14 : Infinity);
        const parents = points.map(() => -1);
        const visited = new Set();
        let goal = -1;
        while (visited.size < points.length) {
            let current = -1;
            points.forEach((_, i) => {
                if (!visited.has(i) && (current < 0 || costs[i] < costs[current])) current = i;
            });
            if (!Number.isFinite(costs[current])) break;
            if (current >= starts.length && current < starts.length + ends.length) { goal = current; break; }
            visited.add(current);
            points.forEach((point, i) => {
                const next = costs[current] + Math.hypot(point.x - points[current].x, point.y - points[current].y) + 8;
                if (!visited.has(i) && next < costs[i] && clearSegment(points[current], point, geometry)) {
                    costs[i] = next;
                    parents[i] = current;
                }
            });
        }
        if (goal < 0) return null;
        const waypoints = [];
        for (let i = goal; i >= 0; i = parents[i]) waypoints.unshift(points[i]);
        waypoints.unshift(waypoints[0].inner);
        waypoints.push(points[goal].inner);
        let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
        for (let i = 1; i < waypoints.length - 1; i++) {
            const a = waypoints[i - 1], b = waypoints[i], c = waypoints[i + 1];
            const ab = Math.hypot(b.x - a.x, b.y - a.y) || 1;
            const bc = Math.hypot(c.x - b.x, c.y - b.y) || 1;
            const radius = Math.min(6, ab / 4, bc / 4);
            const before = { x: b.x + (a.x - b.x) * radius / ab, y: b.y + (a.y - b.y) * radius / ab };
            const after = { x: b.x + (c.x - b.x) * radius / bc, y: b.y + (c.y - b.y) * radius / bc };
            d += ` L ${before.x} ${before.y} Q ${b.x} ${b.y} ${after.x} ${after.y}`;
        }
        const last = waypoints.at(-1);
        return { d: `${d} L ${last.x} ${last.y}`, points: waypoints };
    }

    function routeEdge(edge, geometry) {
        const from = geometry.lights.get(edge.from);
        const to = geometry.lights.get(edge.to);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const reciprocal = session().edges.some(other => other.from === edge.to && other.to === edge.from);
        // Only opposite arrows interact: keep each on its own side, including detours.
        if (reciprocal) geometry = { ...geometry, lane: { x: from.x, y: from.y, dx, dy } };
        const bends = [24, -24, 48, -48, 80, -80, 120, -120, 180, -180, 260, -260, 360, -360, 520, -520, 760, -760];
        const candidates = reciprocal ? [] : [curvedRoute(from, to, null)];
        // Try gentle curves first, on both sides and with different turning points.
        // Only visible geometry is used; the reference causal graph is never consulted.
        for (const bend of bends) {
            if (reciprocal && bend < 48) continue;
            for (const along of [.5, .3, .7]) {
                candidates.push(curvedRoute(from, to, {
                    x: from.x + dx * along - dy / distance * bend,
                    y: from.y + dy * along + dx / distance * bend
                }));
            }
        }
        let best = null;
        let bestScore = Infinity;
        for (const candidate of candidates) {
            if (!candidate) continue;
            const length = candidate.points.reduce((total, point, index) => index
                ? total + Math.hypot(point.x - candidate.points[index - 1].x, point.y - candidate.points[index - 1].y) : total, 0);
            // Keep a visible shaft behind the fixed 12px arrowhead. A short or
            // reversed straight segment must take a curve around the buttons.
            if (length < 28) continue;
            let score = length;
            candidate.points.forEach(point => {
                if (!insideRoutingBounds(point, geometry)) score += 100000;
                for (const obstacle of geometry.obstacles) {
                    if (insideObstacle(point, obstacle)) score += 100000;
                }
            });
            if (score < bestScore) { best = candidate; bestScore = score; }
        }
        return bestScore >= 100000 ? detourRoute(from, to, geometry) || best : best;
    }

    function renderConnections() {
        ui.connections.setAttribute('viewBox', `0 0 ${ui.board.clientWidth} ${ui.board.clientHeight}`);
        ui['edge-layer'].replaceChildren();
        const geometry = routingGeometry();
        session().edges.forEach(edge => {
            const route = routeEdge(edge, geometry);
            const path = route.d;
            const group = document.createElementNS(svgNS, 'g');
            group.setAttribute('class', 'edge');
            group.setAttribute('aria-label', t('edge-label', { from: edge.from, to: edge.to }));
            const title = document.createElementNS(svgNS, 'title');
            title.textContent = t('edge-title', { from: edge.from, to: edge.to });
            const underlay = document.createElementNS(svgNS, 'path');
            underlay.setAttribute('class', 'edge-underlay');
            underlay.setAttribute('d', path);
            const visible = document.createElementNS(svgNS, 'path');
            visible.setAttribute('class', 'edge-line');
            visible.setAttribute('d', path);
            visible.setAttribute('marker-end', 'url(#arrow)');
            const hit = document.createElementNS(svgNS, 'path');
            hit.setAttribute('class', 'edge-hit');
            hit.setAttribute('d', path);
            group.append(title, underlay, visible, hit);
            group.addEventListener('click', () => removeEdge(edge.from, edge.to));
            ui['edge-layer'].append(group);
            // Stop the curved shaft inside the broad base of the 12px head,
            // rather than letting it protrude beside the head near its tip.
            const length = visible.getTotalLength();
            const dash = `${Math.max(0, length - 10)} ${length}`;
            visible.setAttribute('stroke-dasharray', dash);
            underlay.setAttribute('stroke-dasharray', dash);
        });
    }

    function renderEdges() {
        const current = session();
        syncClock();
        ui['clear-edges'].disabled = current.edges.length === 0;
        renderConnections();
        renderFeedback();
    }

    function addEdge(from, to) {
        if (from === to) { announce(t('announce-same-button')); return; }
        if (!activeExercise.nodes.includes(from) || !activeExercise.nodes.includes(to)) return;
        if (session().edges.some(edge => edge.from === from && edge.to === to)) {
            announce(t('announce-edge-exists', { from, to }));
            return;
        }
        session().edges.push({ from, to });
        discovered.arrow = true;
        gestureNotice = '';
        session().feedback = null;
        renderEdges();
        renderTabs();
        renderGuidance();
        announce(t('announce-edge-added', { from, to }));
    }

    function removeEdge(from, to) {
        session().edges = session().edges.filter(edge => edge.from !== from || edge.to !== to);
        session().feedback = null;
        renderEdges();
        renderTabs();
        announce(t('announce-edge-removed', { from, to }));
    }

    function renderFeedback() {
        const result = session().feedback;
        ui.feedback.hidden = result === null;
        if (!result) ui['result-panel'].hidden = true;
        ui.feedback.replaceChildren();
        ui.feedback.classList.toggle('is-correct', result?.correct === true);
        if (!result) return;
        const heading = document.createElement('strong');
        heading.id = 'result-title';
        heading.textContent = t(result.correct ? 'result-correct' : 'result-incorrect');
        const detail = document.createElement('span');
        if (result.correct) {
            const nextExercise = exercises[exercises.indexOf(activeExercise) + 1];
            detail.textContent = activeExercise.timed ? t('result-found-timed', { time: ui['exercise-timer'].textContent })
                : t('result-found');
            const reflection = document.createElement('p');
            reflection.textContent = t('result-reflection');
            ui.feedback.append(heading, detail, reflection);
            if (nextExercise) {
                const next = document.createElement('button');
                next.type = 'button';
                next.id = 'next-level';
                next.className = 'next-button';
                next.textContent = t('result-next');
                next.addEventListener('click', () => {
                    ui['result-panel'].hidden = true;
                    selectExercise(nextExercise);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                });
                ui.feedback.append(next);
            }
            return;
        }
        ui.feedback.append(heading);
    }

    document.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5) drag.moved = true;
        if (!drag.moved) return;
        cancelClicks();
        ui.board.classList.add('is-dragging');
        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.node-light');
        nodeElements.forEach(({ light }, id) => {
            light.classList.toggle('is-drop-target', light === target && id !== drag.from);
        });
        const point = boardPoint(event.clientX, event.clientY);
        ui['draft-edge'].setAttribute('d', pathBetween(center(drag.from), point));
        ui['draft-edge'].removeAttribute('hidden');
    });

    document.addEventListener('pointerup', event => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const finished = drag;
        cancelDraft();
        if (!finished.moved) return;
        cancelClicks();
        ignoreClickUntil = performance.now() + 400;
        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.node-light');
        if (target && ui.nodes.contains(target)) addEdge(finished.from, Number(target.dataset.node));
        else announce(t('announce-edge-cancelled'));
        renderStates();
    });

    document.addEventListener('pointercancel', event => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        cancelDraft();
        cancelClicks();
        ignoreClickUntil = performance.now() + 400;
    });
    window.addEventListener('blur', () => { cancelDraft(); cancelClicks(); });
    ui['reset-buttons'].addEventListener('click', () => {
        cancelClicks();
        cancelDraft();
        session().states = model.createNodeStates(activeExercise);
        gestureNotice = '';
        renderStates();
        renderGuidance();
        announce(t('announce-reset'));
    });
    ui['clear-edges'].addEventListener('click', () => {
        cancelDraft();
        session().edges = [];
        session().feedback = null;
        renderStates();
        renderEdges();
        renderTabs();
        announce(t('announce-cleared'));
    });
    ui['check-edges'].addEventListener('click', () => {
        cancelClicks();
        if (activeExercise.id === 'daily') syncClock();
        session().feedback = model.checkEdges(activeExercise, session().edges);
        syncClock();
        saveDailyResult();
        renderFeedback();
        renderTabs();
        if (!sideHelp.matches) setHelp(false);
        ui['result-panel'].hidden = false;
        layoutBoard();
        renderConnections();
        ui['result-panel'].scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });

    ui['new-graph'].addEventListener('click', () => {
        if (activeExercise.id !== 'random') return;
        const size = Number(ui['random-controls'].querySelector('input:checked').value);
        selectExercise(replaceExercise(model.createRandomExercise(undefined, size)));
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && activeExercise.id === 'daily' && activeExercise.seed !== model.daySeed()) selectExercise(activeExercise);
        else syncClock();
    });
    window.setInterval(() => {
        if (activeExercise.id === 'daily' && activeExercise.seed !== model.daySeed()) selectExercise(activeExercise);
        else syncClock();
    }, 250);

    ui['open-help'].addEventListener('click', () => {
        cancelClicks();
        cancelDraft();
        setHelp(ui['help-panel'].hidden);
    });
    ui['close-help'].addEventListener('click', () => { setHelp(false); ui['open-help'].focus({ preventScroll: true }); });
    ui['close-result'].addEventListener('click', () => {
        ui['result-panel'].hidden = true;
        layoutBoard();
        renderConnections();
    });
    ui['expand-help'].addEventListener('click', () => {
        const expanded = !ui['help-panel'].classList.contains('is-expanded');
        ui['help-panel'].classList.toggle('is-expanded', expanded);
        syncHelp();
        scheduleConnections();
    });

    // Switch language without reloading: the game in progress, timers and
    // arrows stay as they are; every visible or announced text is rendered again.
    function setLanguage(next) {
        language = next;
        try {
            localStorage.setItem('language', next); // shared with the main site
        } catch {
            // Storage unavailable: the choice lasts until the page is closed.
        }
        showLanguageInUrl();
        translateStaticTexts();
        renderTabs();
        renderExerciseTexts();
        renderStates();
        renderGuidance();
        syncHelp();
        syncClock();
        renderFeedback();
        refreshLayout();
        // Replace the last screen-reader announcement, still in the old language.
        announce(t('announce-exercise', { number: exercises.indexOf(activeExercise) + 1,
            label: exerciseText(activeExercise, 'label'), count: activeExercise.nodes.length }));
    }

    ui['language-toggle'].addEventListener('click', () => {
        cancelClicks();
        cancelDraft();
        setLanguage(language === 'fr' ? 'en' : 'fr');
    });

    function syncHelp() {
        const expanded = ui['help-panel'].classList.contains('is-expanded');
        ui['expand-help'].textContent = t(expanded ? 'help-collapse' : 'help-expand');
        ui['expand-help'].setAttribute('aria-expanded', String(expanded));
        ui['help-content'].hidden = !sideHelp.matches && !expanded;
    }

    function setHelp(open) {
        if (open) {
            discovered.help = true;
            gestureNotice = '';
            renderGuidance();
        }
        ui['help-panel'].hidden = !open;
        ui['open-help'].setAttribute('aria-expanded', String(open));
        ui['help-panel'].classList.remove('is-expanded');
        if (open && !sideHelp.matches) ui['result-panel'].hidden = true;
        syncHelp();
        layoutBoard();
        renderConnections();
    }

    // Keep the lights in the free area between the floating controls.
    // On short screens the board can scroll rather than hide a game button.
    function layoutBoard() {
        const app = byId('laboratoire');
        const actions = document.querySelector('.tablet-actions');
        const helpOpen = !ui['help-panel'].hidden;
        app.classList.toggle('has-help', helpOpen);
        syncHelp();
        const appTop = app.getBoundingClientRect().top;
        const top = Math.ceil(ui['game-hud'].getBoundingClientRect().bottom - appTop + 18);
        const actionsHeight = actions.getBoundingClientRect().height + parseFloat(getComputedStyle(actions).bottom);
        app.style.setProperty('--actions-space', `${Math.ceil(actionsHeight + 12)}px`);
        const helpHeight = helpOpen && !sideHelp.matches
            ? ui['help-panel'].querySelector('.dialog-toolbar').getBoundingClientRect().height
                + ui['help-panel'].querySelector('.help-summary').getBoundingClientRect().height + 26 : 0;
        const resultHeight = ui['result-panel'].hidden ? 0 : ui['result-panel'].getBoundingClientRect().height + 12;
        const bottom = Math.ceil(actionsHeight + 18 + Math.max(helpHeight, resultHeight));
        const nodeHeight = nodeElements.values().next().value.node.getBoundingClientRect().height;
        const count = activeExercise.nodes.length;
        const rows = count > 3 ? Math.ceil(count / 3) : count > 2 ? 2 : 1;
        const playHeight = Math.ceil(nodeHeight * rows + (count >= 9 ? 96 : 48));
        app.style.setProperty('--game-min-height', `${top + bottom + playHeight}px`);
        app.style.setProperty('--play-top', `${top}px`);
        app.style.setProperty('--play-bottom', `${bottom}px`);
        if (activeExercise.nodes.length === 9) {
            const area = ui.nodes.getBoundingClientRect();
            // Recompute the spacing using the actual aspect ratio of the play area.
            const layout = positions(activeExercise, area.width, area.height);
            activeExercise.nodes.forEach(id => {
                const node = nodeElements.get(id).node;
                node.style.left = `${layout[id][0]}px`;
                node.style.top = `${layout[id][1]}px`;
            });
        }
        if (activeExercise.nodes.length === 3) {
            const area = ui.nodes.getBoundingClientRect();
            const nodeWidth = nodeElements.values().next().value.node.getBoundingClientRect().width;
            const ratio = Math.sqrt(3) / 2;
            // Let the trio fill the board's width without making it too tall.
            const side = Math.min(area.width * (area.width <= 600 ? .64 : .50), area.width - nodeWidth - 24);
            // Two lights at the base carry more visual weight than the apex.
            // Centre their centroid, with enough room above for the upper light.
            const triangleHeight = Math.min(320 * ratio, side * ratio, .75 * (area.height - nodeHeight - 24));
            const upper = area.height / 2 - 2 * triangleHeight / 3;
            const points = [
                [area.width / 2, upper],
                [(area.width - side) / 2, upper + triangleHeight],
                [(area.width + side) / 2, upper + triangleHeight]
            ];
            activeExercise.nodes.forEach((id, index) => {
                const node = nodeElements.get(id).node;
                node.style.left = `${points[index][0]}px`;
                node.style.top = `${points[index][1]}px`;
            });
        }
    }

    function scheduleConnections() {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(refreshLayout);
    }

    function refreshLayout() {
        layoutBoard();
        renderConnections();
    }
    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(scheduleConnections);
        [ui.board, ui['game-hud'], document.querySelector('.tablet-actions'), ui['result-panel'],
            ui['help-panel'].querySelector('.dialog-toolbar')].forEach(element => observer.observe(element));
    }
    window.addEventListener('resize', refreshLayout);
    sideHelp.addEventListener('change', refreshLayout);

    forgetPastDailies();
    translateStaticTexts();
    showLanguageInUrl();
    createTabs();
    selectExercise(activeExercise);
    // Shown once translated (the inline script hides the page in English until then).
    window.revealAfterTranslation?.();
})();
