"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var CreateNew_1 = require("@src/views/Modules/CreateNew");
var Listing_1 = require("@src/views/Modules/Listing");
var ModuleDetails_1 = require("@src/views/Modules/ModuleDetails");
var UserLayout_1 = require("@src/components/UserLayout");
require("./style.scss");
var Modules = function () { return (React.createElement(UserLayout_1.default, null,
    React.createElement("div", { styleName: "container" },
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses/:courseId/modules", component: Listing_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses/:courseId/modules/new", component: CreateNew_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses/:courseId/modules/:moduleId", component: ModuleDetails_1.default }))))); };
exports.default = Modules;
//# sourceMappingURL=index.js.map