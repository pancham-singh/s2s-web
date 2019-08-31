"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createActionAsync_1 = require("./createActionAsync");
exports.default = (function (name, initialData, options) {
    var data = initialData;
    options = options || {};
    var initialState = {
        isBusy: false,
        data: data,
        error: ''
    };
    var actions = createActionAsync_1.default(name.toUpperCase());
    var reducerMap = function (stateKey) {
        return (_a = {},
            _a[actions.start().type] = function (state, _a) {
                var payload = _a.payload;
                return Object.assign({}, state, (_b = {},
                    _b[stateKey] = {
                        isBusy: true,
                        error: '',
                        data: payload
                    },
                    _b));
                var _b;
            },
            _a[actions.fail().type] = function (state, _a) {
                var payload = _a.payload;
                return Object.assign({}, state, (_b = {},
                    _b[stateKey] = {
                        isBusy: false,
                        error: payload,
                        data: state[stateKey].data
                    },
                    _b));
                var _b;
            },
            _a[actions.success().type] = function (state, _a) {
                var payload = _a.payload;
                return Object.assign({}, state, (_b = {},
                    _b[stateKey] = {
                        error: '',
                        isBusy: false,
                        data: initialData
                    },
                    _b));
                var _b;
            },
            _a);
        var _a;
    };
    return {
        actions: actions,
        initialState: initialState,
        reducerMap: reducerMap
    };
});
//# sourceMappingURL=createDuck.js.map