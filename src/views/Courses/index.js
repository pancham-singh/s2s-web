"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserLayout_1 = require("@src/components/UserLayout");
var CreateNew_1 = require("@src/views/Courses/CreateNew");
var Listing_1 = require("@src/views/Courses/Listing");
var CourseDetails_1 = require("@src/views/Courses/CourseDetails");
require("./style.scss");
var Courses = function () { return (React.createElement(UserLayout_1.default, null,
    React.createElement("div", { styleName: "container" },
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses", component: Listing_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses/new", component: CreateNew_1.default }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/courses/:courseId", component: CourseDetails_1.default }))))); };
exports.default = Courses;
//# sourceMappingURL=index.js.map