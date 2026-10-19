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
        'close-result', 'result-panel', 'expand-help', 'help-content'
    ].map(id => [id, byId(id)]));

    // Only the true causal model affects the lights. A learner's arrows never do.
    const sessions = new Map(model.exercises.map(exercise => [exercise.id, {
        states: model.createNodeStates(exercise), edges: [],
        feedback: null
    }]));
    const nodeElements = new Map();
    const tabElements = new Map();
    const clickTimers = new Map();
    const discovered = { intervention: false, value: false, arrow: false };
    let gestureNotice = '';
    let activeExercise = model.exercises[0];
    let drag = null;
    let ignoreClickUntil = 0;
    let resizeFrame = 0;
    const sideHelp = window.matchMedia('(min-width: 1000px)');

    function session() { return sessions.get(activeExercise.id); }
    function announce(message) { ui.announcement.textContent = message; }

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
        model.exercises.forEach(exercise => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'exercise-tab';
            button.id = `tab-${exercise.id}`;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', 'exercise-panel');
            const label = document.createElement('span');
            label.textContent = exercise.label;
            const done = document.createElement('span');
            done.className = 'tab-done';
            done.textContent = '✓';
            done.setAttribute('aria-hidden', 'true');
            button.append(label, done);
            button.addEventListener('click', () => selectExercise(exercise));
            tabElements.set(exercise.id, button);
            ui['exercise-tabs'].append(button);
        });
    }

    function renderTabs() {
        model.exercises.forEach((exercise, index) => {
            const button = tabElements.get(exercise.id);
            const selected = exercise === activeExercise;
            const solved = sessions.get(exercise.id).feedback?.correct === true;
            button.setAttribute('aria-selected', String(selected));
            button.setAttribute('aria-label', `Exercice ${index + 1}, ${exercise.label}, ${exercise.nodes.length} boutons${solved ? ', réussi' : ''}`);
            button.querySelector('.tab-done').hidden = !solved;
        });
    }

    function positions(exercise) {
        if (exercise.id === 'reseau') {
            // A neutral, fixed arrangement; never infer positions from edges.
            return { 0: [27, 17], 6: [73, 17], 14: [17, 50], 4: [50, 50], 13: [83, 50], 5: [27, 83], 12: [73, 83] };
        }
        const points = exercise.nodes.length === 2 ? [[30, 50], [70, 50]] : [[50, 25], [24, 75], [76, 75]];
        return Object.fromEntries(exercise.nodes.map((id, index) => [id, points[index]]));
    }

    function createNodes() {
        ui.nodes.replaceChildren();
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
        cancelClicks();
        cancelDraft();
        activeExercise = exercise;
        ui['result-panel'].hidden = true;
        ui.board.dataset.exercise = exercise.id;
        ui['exercise-panel'].setAttribute('aria-labelledby', `tab-${exercise.id}`);
        ui['exercise-title'].textContent = exercise.title;
        ui['exercise-description'].textContent = exercise.description;
        gestureNotice = '';
        renderTabs();
        createNodes();
        renderStates();
        renderGuidance();
        layoutBoard();
        renderEdges();
        announce(`Exercice ${model.exercises.indexOf(exercise) + 1} : ${exercise.label}. ${exercise.nodes.length} boutons.`);
    }

    function renderStates() {
        const current = session();
        activeExercise.nodes.forEach(id => {
            const state = current.states[id];
            const element = nodeElements.get(id);
            const modeName = state.isInterv ? 'Intervention' : 'Naturel';
            const valueName = state.isOn ? 'allumé' : 'éteint';
            element.light.classList.toggle('is-on', state.isOn);
            element.light.classList.toggle('is-intervention', state.isInterv);
            element.light.setAttribute('aria-pressed', String(state.isOn));
            element.light.setAttribute('aria-label', `Bouton ${id}, ${modeName.toLowerCase()}, ${valueName}. Appui simple : changer la valeur en intervention. Double appui : changer de mode. Glisser vers un autre bouton : tracer une flèche.`);
            element.light.title = 'Appui simple : allumer ou éteindre en intervention. Double appui : changer de mode. Glisser : tracer une flèche.';
        });
    }

    function renderGuidance() {
        let step = 'done';
        let message = '';
        const hasIntervention = activeExercise.nodes.some(id => session().states[id].isInterv);
        if (!discovered.intervention || (!discovered.value && !hasIntervention)) {
            step = 'intervention';
            message = 'Appuyez deux fois sur un bouton pour intervenir.';
        } else if (!discovered.value) {
            step = 'value';
            message = 'Appuyez une fois sur le bouton rouge pour l’allumer. Observez les autres.';
        } else if (!discovered.arrow) {
            step = 'arrow';
            message = 'Faites glisser un bouton vers un autre pour proposer une flèche.';
        }
        const hint = ui['first-steps'];
        hint.dataset.step = step;
        hint.textContent = gestureNotice || message;
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
        announceStates(`Bouton ${id} ${session().states[id].isInterv ? 'en intervention' : 'rendu naturel'}.`);
    }

    function changeValue(id) {
        if (!session().states[id].isInterv) {
            gestureNotice = 'Ce bouton est naturel. Appuyez deux fois dessus pour intervenir.';
            renderGuidance();
            announce(`Bouton ${id} naturel. Faites un double appui pour passer en intervention et changer sa valeur.`);
            return;
        }
        session().states = model.toggleValue(activeExercise, session().states, id);
        discovered.value = true;
        gestureNotice = '';
        renderStates();
        renderGuidance();
        announceStates(`Valeur du bouton ${id} modifiée.`);
    }

    function announceStates(prefix) {
        const values = activeExercise.nodes.map(id => {
            const state = session().states[id];
            return `${id} : ${state.isOn ? 'allumé' : 'éteint'}${state.isInterv ? ' en intervention' : ''}`;
        });
        announce(`${prefix} ${values.join('. ')}.`);
    }

    function handleLightClick(event, id) {
        // Keyboard and assistive-technology clicks need no double-click delay.
        if (event.detail === 0) { changeValue(id); return; }
        if (performance.now() < ignoreClickUntil) return;
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
                y: rect.top + rect.height / 2 - board.top, radius: rect.width / 2 + 12 };
            lights.set(id, point);
            obstacles.push({ ...point, radius: rect.width / 2 + 7 });
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

    function routeEdge(edge, geometry, previous) {
        const from = geometry.lights.get(edge.from);
        const to = geometry.lights.get(edge.to);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const reciprocal = session().edges.some(other => other.from === edge.to && other.to === edge.from);
        // Give opposite arrows opposite sides of the line between their lights.
        // Apply this to detours too, so both cannot pick the same narrow passage.
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
            let score = 0;
            candidate.points.forEach((point, index) => {
                if (!insideRoutingBounds(point, geometry)) score += 100000;
                for (const obstacle of geometry.obstacles) {
                    if (insideObstacle(point, obstacle)) score += 100000;
                }
                if (index) score += Math.hypot(point.x - candidate.points[index - 1].x, point.y - candidate.points[index - 1].y);
                if (index % 6 === 0) {
                    for (const route of previous) {
                        for (let i = 0; i < route.points.length; i += 6) {
                            if (Math.hypot(point.x - route.points[i].x, point.y - route.points[i].y) < 10) score += 10;
                        }
                    }
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
        const routes = [];
        session().edges.forEach(edge => {
            const route = routeEdge(edge, geometry, routes);
            routes.push(route);
            const path = route.d;
            const group = document.createElementNS(svgNS, 'g');
            group.setAttribute('class', 'edge');
            group.setAttribute('aria-label', `Supprimer la flèche ${edge.from} vers ${edge.to}`);
            const title = document.createElementNS(svgNS, 'title');
            title.textContent = `Supprimer ${edge.from} → ${edge.to}`;
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
        });
    }

    function renderEdges() {
        const current = session();
        ui['clear-edges'].disabled = current.edges.length === 0;
        renderConnections();
        renderFeedback();
    }

    function addEdge(from, to) {
        if (from === to) { announce('Choisissez deux boutons différents.'); return; }
        if (!activeExercise.nodes.includes(from) || !activeExercise.nodes.includes(to)) return;
        if (session().edges.some(edge => edge.from === from && edge.to === to)) {
            announce(`La flèche ${from} vers ${to} existe déjà.`);
            return;
        }
        session().edges.push({ from, to });
        discovered.arrow = true;
        gestureNotice = '';
        session().feedback = null;
        renderEdges();
        renderTabs();
        renderGuidance();
        announce(`Flèche ajoutée : ${from} vers ${to}.`);
    }

    function removeEdge(from, to) {
        session().edges = session().edges.filter(edge => edge.from !== from || edge.to !== to);
        session().feedback = null;
        renderEdges();
        renderTabs();
        announce(`Flèche supprimée : ${from} vers ${to}.`);
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
        heading.textContent = result.correct ? 'Bien joué !' : 'Pas encore…';
        const detail = document.createElement('span');
        if (result.correct) {
            const nextExercise = model.exercises[model.exercises.indexOf(activeExercise) + 1];
            detail.textContent = nextExercise ? 'Vous avez trouvé toutes les flèches.' : 'Vous avez terminé le dernier niveau !';
            const reflection = document.createElement('p');
            reflection.textContent = 'Êtes-vous sûr d’avoir tout testé ou avez-vous eu de la chance ?';
            ui.feedback.append(heading, detail, reflection);
            if (nextExercise) {
                const next = document.createElement('button');
                next.type = 'button';
                next.id = 'next-level';
                next.className = 'next-button';
                next.textContent = 'Niveau suivant →';
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
        else announce('Flèche annulée. Déposez-la sur la lumière d’un autre bouton.');
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
        announce('Tous les boutons sont naturels et éteints. Vos flèches sont conservées.');
    });
    ui['clear-edges'].addEventListener('click', () => {
        cancelDraft();
        session().edges = [];
        session().feedback = null;
        renderStates();
        renderEdges();
        renderTabs();
        announce('Toutes les flèches de cet exercice ont été effacées. Les boutons gardent leur état.');
    });
    ui['check-edges'].addEventListener('click', () => {
        cancelClicks();
        session().feedback = model.checkEdges(activeExercise, session().edges);
        renderFeedback();
        renderTabs();
        if (!sideHelp.matches) setHelp(false);
        ui['result-panel'].hidden = false;
        layoutBoard();
        renderConnections();
        ui['result-panel'].scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });

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

    function syncHelp() {
        const expanded = ui['help-panel'].classList.contains('is-expanded');
        ui['expand-help'].textContent = expanded ? 'Réduire pour jouer' : 'Développer';
        ui['expand-help'].setAttribute('aria-expanded', String(expanded));
        ui['help-content'].hidden = !sideHelp.matches && !expanded;
    }

    function setHelp(open) {
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
        const rows = activeExercise.nodes.length > 3 ? 3 : activeExercise.nodes.length > 2 ? 2 : 1;
        const playHeight = Math.ceil(nodeHeight * rows + 48);
        app.style.setProperty('--game-min-height', `${top + bottom + playHeight}px`);
        app.style.setProperty('--play-top', `${top}px`);
        app.style.setProperty('--play-bottom', `${bottom}px`);
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
        resizeFrame = requestAnimationFrame(() => {
            layoutBoard();
            renderConnections();
        });
    }
    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(scheduleConnections);
        [ui.board, ui['game-hud'], document.querySelector('.tablet-actions'), ui['result-panel'],
            ui['help-panel'].querySelector('.dialog-toolbar')].forEach(element => observer.observe(element));
    }
    window.addEventListener('resize', scheduleConnections);

    createTabs();
    selectExercise(activeExercise);
})();
