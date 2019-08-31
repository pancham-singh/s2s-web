"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (user) { return function () {
    var role = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        role[_i] = arguments[_i];
    }
    return Boolean(user && user.roles && user.roles.find(function (r) { return role.includes(r.name); }));
}; });
//# sourceMappingURL=hasRole.js.map