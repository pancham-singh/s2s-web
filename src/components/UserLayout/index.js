"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_apollo_1 = require("react-apollo");
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
require("./style.scss");
var auth_1 = require("@src/auth");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var hasRole_1 = require("@src/lib/hasRole");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var handleLogout = function (client) { return function () {
    client.resetStore();
    auth_1.logoutLocal();
}; };
var UserLayout = function (props) { return (React.createElement("div", { styleName: "container" },
    React.createElement(react_apollo_1.Query, { query: current_user_graphql_1.default }, function (_a) {
        var client = _a.client, loading = _a.loading, error = _a.error, currentUser = _a.data.currentUser;
        if (loading) {
            return React.createElement(Loader_1.default, { isVisible: true });
        }
        if (error) {
            return React.createElement(ApolloError_1.default, { error: error });
        }
        var userHasRole = hasRole_1.default(currentUser);
        return (React.createElement("nav", { styleName: "top-navbar" },
            React.createElement("h2", { styleName: "brand" },
                React.createElement(react_router_dom_1.NavLink, { to: "/dashboard" }, "Skill2Skills")),
            userHasRole('admin') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/courses" }, "Courses")),
            userHasRole('admin') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/users" }, "Users")),
            userHasRole('admin', 'pia') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/training-centers" }, "Training Centers")),
            userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/batches" }, "Batches")),
            userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/invitations" }, "Invitations")),
            userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/assessments" }, "Assessments")),
            userHasRole('admin', 'pia', 'centerIncharge', 'teacher', 'student') && (React.createElement(react_router_dom_1.NavLink, { styleName: "nav-link", to: "/tests" }, "Tests")),
            React.createElement("div", { styleName: "fly-right" },
                React.createElement("span", { styleName: "email" }, currentUser.email),
                React.createElement("a", { styleName: "logout", onClick: handleLogout(client) }, "Logout"))));
    }),
    React.createElement(react_toastify_1.ToastContainer, { position: "bottom-center", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnVisibilityChange: true, draggable: true, pauseOnHover: true }),
    React.createElement("div", { styleName: "content" }, props.children))); };
exports.default = UserLayout;
//# sourceMappingURL=index.js.map