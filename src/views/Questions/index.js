"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var CreateNew_1 = require("@src/views/Questions/CreateNew");
var Listing_1 = require("@src/views/Questions/Listing");
var QuestionDetails_1 = require("@src/views/Questions/QuestionDetails");
var UserLayout_1 = require("@src/components/UserLayout");
require("./style.scss");
var Questions = function () {
    var pathPrefix = "/topics/:topicId/questions";
    return (React.createElement(UserLayout_1.default, null,
        React.createElement("div", { styleName: "container" },
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(react_router_dom_1.Route, { exact: true, path: "" + pathPrefix, component: Listing_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: pathPrefix + "/new", component: CreateNew_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: pathPrefix + "/:questionId", component: QuestionDetails_1.default })))));
};
exports.default = Questions;
//# sourceMappingURL=index.js.map