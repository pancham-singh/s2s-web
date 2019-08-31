"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createAction_1 = require("./createAction");
exports.default = (function (type) { return ({
    start: createAction_1.default("START_" + type),
    success: createAction_1.default("SUCCESS_" + type),
    fail: createAction_1.default("FAIL_" + type)
}); });
//# sourceMappingURL=createActionAsync.js.map