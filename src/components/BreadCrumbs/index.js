"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./style.scss");
var BreadCrumbs = function (props) {
    var crumbs = Object.entries(props.crumbs);
    return (React.createElement("div", { styleName: "container" }, crumbs.map(function (_a, index) {
        var title = _a[0], href = _a[1];
        return (React.createElement("span", { key: title },
            href && (React.createElement("span", null,
                React.createElement(react_router_dom_1.Link, { styleName: "crumb", to: href }, title),
                React.createElement("span", null, " / "))),
            !href && React.createElement("span", { styleName: "dead-crumb" }, title)));
    })));
};
exports.default = BreadCrumbs;
//# sourceMappingURL=index.js.map