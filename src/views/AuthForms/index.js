"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var Login_1 = require("./Login");
var Signup_1 = require("./Signup");
require("./style.scss");
var AuthForms = function (props) {
    var activeForm = /login/.test(props.location.pathname) ? 'login' : 'signup';
    return (React.createElement("div", { styleName: "container" },
        React.createElement("div", { styleName: "content" },
            React.createElement("div", { styleName: "nav-tabs" },
                React.createElement("div", { styleName: activeForm === 'signup' ? 'active' : 'in-active' },
                    React.createElement(react_router_dom_1.Link, { to: "/signup" }, "Sign Up")),
                React.createElement("div", { styleName: activeForm === 'login' ? 'active' : 'in-active' },
                    React.createElement(react_router_dom_1.Link, { to: "/login" }, "Log In"))),
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(react_router_dom_1.Route, { path: "/login", exact: true, component: Login_1.default }),
                React.createElement(react_router_dom_1.Route, { path: "/signup", exact: true, component: Signup_1.default })))));
};
exports.default = AuthForms;
//# sourceMappingURL=index.js.map