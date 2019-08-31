"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createLogger_1 = require("@src/lib/createLogger");
var log = createLogger_1.default('handleGraphqlError');
exports.default = (function (res) {
    if (res instanceof Error) {
        return res;
    }
    for (var _i = 0, _a = res.errors; _i < _a.length; _i++) {
        var err = _a[_i];
        log(err);
    }
    return res.errors[0];
});
//# sourceMappingURL=handleGraphqlError.js.map