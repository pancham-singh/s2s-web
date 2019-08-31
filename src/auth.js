"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLocal = function (token) {
    localStorage.setItem('token', token);
};
exports.logoutLocal = function () {
    localStorage.removeItem('token');
};
exports.getToken = function () {
    return localStorage.getItem('token');
};
//# sourceMappingURL=auth.js.map