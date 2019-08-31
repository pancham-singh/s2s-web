"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserLayout_1 = require("@src/components/UserLayout");
var Listing_1 = require("@src/views/Tests/Listing");
var CreateNew_1 = require("@src/views/Tests/CreateNew");
require("./style.scss");
var Tests = function () { return (React.createElement(UserLayout_1.default, null,
    React.createElement("div", { styleName: "container" },
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/tests", component: Listing_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/tests/:testId", component: CreateNew_1.default }))))); };
exports.default = Tests;
//# sourceMappingURL=index.js.map