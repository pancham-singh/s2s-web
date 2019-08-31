"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var Loader = function (_a) {
    var isVisible = _a.isVisible;
    return !isVisible ? null : (React.createElement("div", { styleName: "full-page-overlay" },
        React.createElement("div", { styleName: "full-page-loader" })));
};
exports.default = Loader;
//# sourceMappingURL=index.js.map