"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var ApolloError = function (_a) {
    var error = _a.error;
    return React.createElement("div", { styleName: "container" }, error.message);
};
exports.default = ApolloError;
//# sourceMappingURL=index.js.map