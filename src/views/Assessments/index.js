"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserLayout_1 = require("@src/components/UserLayout");
var Listing_1 = require("@src/views/Assessments/Listing");
var CreateNew_1 = require("@src/views/Assessments/CreateNew");
require("./style.scss");
var Assessments = function () { return (React.createElement(UserLayout_1.default, null,
    React.createElement("div", { styleName: "container" },
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/assessments/new", component: CreateNew_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/assessments", component: Listing_1.default }))))); };
exports.default = Assessments;
//# sourceMappingURL=index.js.map