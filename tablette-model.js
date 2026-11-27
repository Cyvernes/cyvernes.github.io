/* Causal simulation: Arduino exercises and generated DAGs, independent of the interface. */
(function (root) {
    'use strict';

    // Use the compact data, rather than the Arduino comments (some are outdated).
    const graphData = [2, 12, 14, 0, 1, 3, 1, 1, 1, 12, 2, 0, 4, 1, 5, 1, 8, 0, 2, 10, 11, 0, 0, 1, 13, 0, 0];
    const graphIndex = [0, 3, 4, 6, 8, 10, 13, 15, 17, 18, 21, 22, 23, 25, 26];
    const parents = Object.freeze(graphIndex.map(start => Object.freeze(graphData.slice(start + 1, start + 1 + graphData[start]))));

    // Start with the four connected components, not the physical button layout.
    // The exercise names (in tablette-translations.js, keyed by id) deliberately
    // leave the causal structure to discover. The model holds no text.
    const exercises = Object.freeze([
        { id: 'duo', nodes: [7, 8] },
        { id: 'trio-1', nodes: [9, 10, 11] },
        { id: 'trio-2', nodes: [1, 2, 3] },
        { id: 'reseau', nodes: [0, 4, 5, 6, 12, 13, 14] }
    ].map(exercise => Object.freeze({ ...exercise, parents, nodes: Object.freeze(exercise.nodes) })).concat([
        createRandomExercise(), createDailyExercise()
    ]));

    function daySeed(date = new Date()) {
        // Everyone playing on the same Paris calendar day gets the same graph.
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
        }).formatToParts(date);
        const part = type => parts.find(item => item.type === type).value;
        return Number(`${part('year')}${part('month')}${part('day')}`);
    }

    function generateGraph(seed, size, edgeCount) {
        let state = seed >>> 0;
        const random = () => {
            state = (state + 0x6D2B79F5) >>> 0;
            let value = Math.imul(state ^ state >>> 15, 1 | state);
            value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
            return ((value ^ value >>> 14) >>> 0) / 4294967296;
        };
        const shuffle = values => {
            for (let i = values.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [values[i], values[j]] = [values[j], values[i]];
            }
            return values;
        };
        const nodes = Array.from({ length: size }, (_, id) => id);
        const order = shuffle([...nodes]);
        const rank = new Map(order.map((id, index) => [id, index]));
        const tree = shuffle([...nodes]);
        const graph = nodes.map(() => []);
        // A spanning tree keeps every button involved. All edges follow a hidden
        // shuffled order, so neither cycles nor positional clues can appear.
        for (let i = 1; i < size; i++) {
            const a = tree[i], b = tree[Math.floor(random() * i)];
            const [from, to] = rank.get(a) < rank.get(b) ? [a, b] : [b, a];
            graph[to].push(from);
        }
        const candidates = [];
        for (let i = 0; i < size; i++) for (let j = i + 1; j < size; j++) {
            if (!graph[order[j]].includes(order[i])) candidates.push([order[i], order[j]]);
        }
        for (const [from, to] of shuffle(candidates).slice(0, edgeCount - size + 1)) graph[to].push(from);
        return { seed: seed >>> 0, nodes: Object.freeze(nodes),
            parents: Object.freeze(graph.map(list => Object.freeze(list.sort((a, b) => a - b)))) };
    }

    function createRandomExercise(seed = globalThis.crypto.getRandomValues(new Uint32Array(1))[0], size = 7) {
        const edgeCount = size + Math.floor((size - 7) / 2);
        return Object.freeze({ id: 'random', timed: true, ...generateGraph(seed, size, edgeCount) });
    }

    // The seed is the Paris calendar day (YYYYMMDD); the interface formats it as a date.
    function createDailyExercise(date = new Date()) {
        return Object.freeze({ id: 'daily', timed: true, ...generateGraph(daySeed(date), 9, 11) });
    }

    function topologicalOrder(exercise) {
        const order = [];
        const remaining = new Set(exercise.nodes);
        while (remaining.size) {
            const ready = [...remaining].filter(id => exercise.parents[id].every(parent => order.includes(parent)));
            if (!ready.length) throw new Error('Le graphe de référence doit être acyclique et l’exercice indépendant.');
            ready.forEach(id => { order.push(id); remaining.delete(id); });
        }
        return order;
    }

    const orders = new WeakMap();

    function createNodeStates(exercise) {
        return Object.fromEntries(exercise.nodes.map(id => [id, { isOn: false, isInterv: false }]));
    }

    function evaluate(exercise, states) {
        const next = Object.fromEntries(exercise.nodes.map(id => [id, { ...states[id] }]));
        if (!orders.has(exercise)) orders.set(exercise, topologicalOrder(exercise));
        for (const id of orders.get(exercise)) {
            if (!next[id].isInterv) {
                next[id].isOn = exercise.parents[id].some(parent => next[parent].isOn);
            }
        }
        return next;
    }

    function toggleIntervention(exercise, states, id) {
        const next = { ...states, [id]: { ...states[id] } };
        // Entering intervention preserves the current value. Leaving restores
        // the default (false), then immediately recomputes the natural value.
        if (next[id].isInterv) next[id].isOn = false;
        next[id].isInterv = !next[id].isInterv;
        return evaluate(exercise, next);
    }

    function toggleValue(exercise, states, id) {
        if (!states[id].isInterv) return states;
        return evaluate(exercise, { ...states, [id]: { ...states[id], isOn: !states[id].isOn } });
    }

    function edgeKey(from, to) { return `${from}>${to}`; }

    function checkEdges(exercise, edges) {
        const expected = new Set(exercise.nodes.flatMap(to => exercise.parents[to].map(from => edgeKey(from, to))));
        const proposed = new Set(edges.map(edge => edgeKey(edge.from, edge.to)));
        const missing = [...expected].filter(key => !proposed.has(key)).length;
        const extra = [...proposed].filter(key => !expected.has(key)).length;
        return { correct: missing === 0 && extra === 0, missing, extra };
    }

    const api = Object.freeze({ exercises, parents, daySeed, createRandomExercise, createDailyExercise,
        createNodeStates, evaluate, toggleIntervention, toggleValue, edgeKey, checkEdges });
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CausalTablet = api;
})(globalThis);
