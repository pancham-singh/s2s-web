"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var ProtectedRoute_1 = require("@src/components/ProtectedRoute");
require("./style.scss");
var ComingSoon_1 = require("@src/components/ComingSoon");
var Loader_1 = require("@src/components/Loader");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var react_apollo_1 = require("react-apollo");
var hasRole_1 = require("@src/lib/hasRole");
var AuthForms_1 = require("@src/views/AuthForms");
var Batches_1 = require("@src/views/Batches");
var Courses_1 = require("@src/views/Courses");
var Invitations_1 = require("@src/views/Invitations");
var Modules_1 = require("@src/views/Modules");
var Topics_1 = require("@src/views/Topics");
var TrainingCenters_1 = require("@src/views/TrainingCenters");
var Users_1 = require("@src/views/Users");
var AcceptInvitation_1 = require("@src/views/AcceptInvitation");
var Assessments_1 = require("@src/views/Assessments");
var CreateNew_1 = require("@src/views/Assessments/CreateNew");
var Tests_1 = require("@src/views/Tests");
var App = function (props) {
    return (React.createElement(react_apollo_1.Query, { query: current_user_graphql_1.default }, function (_a) {
        var loading = _a.loading, data = _a.data, error = _a.error, client = _a.client;
        if (loading) {
            return React.createElement(Loader_1.default, { isVisible: true });
        }
        if (error) {
            console.warn(error);
        }
        var currentUser = data && data.currentUser;
        var userHasRole = hasRole_1.default(currentUser);
        return (React.createElement(react_router_dom_1.Switch, null,
            React.createElement(ProtectedRoute_1.default, { path: "/login", redirectToPath: "/dashboard", canProceed: !currentUser, component: AuthForms_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/signup", redirectToPath: "/dashboard", canProceed: !currentUser, component: AuthForms_1.default }),
            React.createElement(react_router_dom_1.Route, { path: "/dashboard", render: function () {
                    if (!currentUser) {
                        return React.createElement(react_router_dom_1.Redirect, { to: "/login" });
                    }
                    if (userHasRole('admin')) {
                        return React.createElement(react_router_dom_1.Redirect, { to: "/courses" });
                    }
                    if (userHasRole('pia')) {
                        return React.createElement(react_router_dom_1.Redirect, { to: "/training-centers" });
                    }
                    if (userHasRole('student')) {
                        return React.createElement(react_router_dom_1.Redirect, { to: "/tests" });
                    }
                    if (userHasRole('teacher') || userHasRole('centerIncharge')) {
                        return React.createElement(react_router_dom_1.Redirect, { to: "/batches" });
                    }
                    return React.createElement(ComingSoon_1.default, null);
                } }),
            React.createElement(ProtectedRoute_1.default, { path: "/modules/:moduleId/topics", redirectToPath: "/login", canProceed: userHasRole('admin'), component: Topics_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/courses/:courseId/modules", redirectToPath: "/login", canProceed: userHasRole('admin'), component: Modules_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/courses", redirectToPath: "/login", canProceed: userHasRole('admin'), component: Courses_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/users", redirectToPath: "/login", canProceed: userHasRole('admin'), component: Users_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/training-centers", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia'), component: TrainingCenters_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/batches", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia', 'teacher', 'centerIncharge'), component: Batches_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/invitations", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia', 'teacher', 'centerIncharge'), component: Invitations_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/assessments", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia', 'teacher', 'centerIncharge'), component: Assessments_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/assessments/new", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia', 'teacher', 'centerIncharge'), component: CreateNew_1.default }),
            React.createElement(ProtectedRoute_1.default, { path: "/tests", redirectToPath: "/login", canProceed: userHasRole('admin', 'pia', 'teacher', 'centerIncharge', 'student'), component: Tests_1.default }),
            React.createElement(react_router_dom_1.Route, { path: "/accept-invitation/:token", component: AcceptInvitation_1.default }),
            !currentUser ? (React.createElement(react_router_dom_1.Redirect, { path: "*", exact: true, to: "/login" })) : (React.createElement(react_router_dom_1.Redirect, { path: "*", exact: true, to: "/dashboard" }))));
    }));
};
exports.default = App;
//# sourceMappingURL=index.js.map