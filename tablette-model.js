/* Logical behavior of code_arduino.ino, independent of the interface. */
(function (root) {
    'use strict';

    // Use the compact data, rather than the Arduino comments (some are outdated).
    const graphData = [2, 12, 14, 0, 1, 3, 1, 1, 1, 12, 2, 0, 4, 1, 5, 1, 8, 0, 2, 10, 11, 0, 0, 1, 13, 0, 0];
    const graphIndex = [0, 3, 4, 6, 8, 10, 13, 15, 17, 18, 21, 22, 23, 25, 26];
    const parents = Object.freeze(graphIndex.map(start => Object.freeze(graphData.slice(start + 1, start + 1 + graphData[start]))));

    // These are the four connected components, not the physical button layout.
    // The exercise names deliberately leave the causal structure to discover.
    const exercises = Object.freeze([
        { id: 'duo', label: 'Le duo', title: 'Deux boutons, un premier lien.', description: 'Commencez par intervenir sur chacun des boutons. Pouvez-vous trouver lequel agit sur l’autre ?', nodes: [7, 8] },
        { id: 'trio-1', label: 'Trio I', title: 'Trois boutons à explorer.', description: 'Comparez les effets de vos interventions, seules puis combinées. Quelles relations directes expliquent vos observations ?', nodes: [9, 10, 11] },
        { id: 'trio-2', label: 'Trio II', title: 'Un autre trio, d’autres effets.', description: 'Observez ce qui change quand vous imposez un état. Tous les effets observés correspondent-ils à une relation directe ?', nodes: [1, 2, 3] },
        { id: 'reseau', label: 'Le réseau', title: 'À vous de démêler le réseau.', description: 'Sept boutons, plusieurs chemins possibles. Combinez les interventions pour distinguer les causes directes des effets indirects.', nodes: [0, 4, 5, 6, 12, 13, 14] }
    ].map(exercise => Object.freeze({ ...exercise, nodes: Object.freeze(exercise.nodes) })));

    function topologicalOrder(exercise) {
        const order = [];
        const remaining = new Set(exercise.nodes);
        while (remaining.size) {
            const ready = [...remaining].filter(id => parents[id].every(parent => order.includes(parent)));
            if (!ready.length) throw new Error('Le graphe de référence doit être acyclique et l’exercice indépendant.');
            ready.forEach(id => { order.push(id); remaining.delete(id); });
        }
        return order;
    }

    const orders = new Map(exercises.map(exercise => [exercise.id, topologicalOrder(exercise)]));

    function createNodeStates(exercise) {
        return Object.fromEntries(exercise.nodes.map(id => [id, { isOn: false, isInterv: false }]));
    }

    function evaluate(exercise, states) {
        const next = Object.fromEntries(exercise.nodes.map(id => [id, { ...states[id] }]));
        for (const id of orders.get(exercise.id)) {
            if (!next[id].isInterv) {
                next[id].isOn = parents[id].some(parent => next[parent].isOn);
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
        const expected = new Set(exercise.nodes.flatMap(to => parents[to].map(from => edgeKey(from, to))));
        const proposed = new Set(edges.map(edge => edgeKey(edge.from, edge.to)));
        const missing = [...expected].filter(key => !proposed.has(key)).length;
        const extra = [...proposed].filter(key => !expected.has(key)).length;
        return { correct: missing === 0 && extra === 0, missing, extra };
    }

    const api = Object.freeze({ exercises, parents, createNodeStates, evaluate, toggleIntervention, toggleValue, edgeKey, checkEdges });
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CausalTablet = api;
})(globalThis);
