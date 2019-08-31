"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserLayout_1 = require("@src/components/UserLayout");
var Listing_1 = require("@src/views/Users/Listing");
require("./style.scss");
var Users = function () { return (React.createElement(UserLayout_1.default, null,
    React.createElement("div", { styleName: "container" },
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/users", component: Listing_1.default }))))); };
exports.default = Users;
//# sourceMappingURL=index.js.map