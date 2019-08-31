"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-escape */
exports.default = (function (email) {
    var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRe.test(email);
});
//# sourceMappingURL=validateEmail.js.map