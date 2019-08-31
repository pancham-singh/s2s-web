"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (reducers, options) { return function (state, action) {
    var initialState = options.initialState === undefined ? {} : options.initialState;
    var finalReducers = __assign({}, reducers);
    Object.entries(options.ducks || {}).forEach(function (_a) {
        var name = _a[0], duck = _a[1];
        initialState[name] = duck.initialState;
        var duckReducers = duck.reducerMap(name);
        // Combined reducers when duck has same key as reducers
        var aggregatedReducers = {};
        // duck can have a reducer with same key
        if (!aggregatedReducers[action.type] && duckReducers[action.type] && reducers[action.type]) {
            aggregatedReducers[action.type] = function (s, a) {
                var duckState = duckReducers[action.type](s, a);
                var actionMapState = reducers[a.type](duckState, a);
                return Object.assign({}, duckState, actionMapState);
            };
        }
        finalReducers = __assign({}, finalReducers, duckReducers, aggregatedReducers);
    });
    var reducer = finalReducers[action.type] || (function (s) {
        if (s === void 0) { s = initialState; }
        return s;
    });
    return reducer(state, action);
}; });
//# sourceMappingURL=createReducer.js.map