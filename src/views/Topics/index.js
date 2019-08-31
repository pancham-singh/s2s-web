"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var CreateNew_1 = require("@src/views/Topics/CreateNew");
var Listing_1 = require("@src/views/Topics/Listing");
var TopicDetails_1 = require("@src/views/Topics/TopicDetails");
var UserLayout_1 = require("@src/components/UserLayout");
require("./style.scss");
var Topics = function () {
    var pathPrefix = "/modules/:moduleId/topics";
    return (React.createElement(UserLayout_1.default, null,
        React.createElement("div", { styleName: "container" },
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(react_router_dom_1.Route, { exact: true, path: "" + pathPrefix, component: Listing_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: pathPrefix + "/new", component: CreateNew_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: pathPrefix + "/:topicId", component: TopicDetails_1.default })))));
};
exports.default = Topics;
//# sourceMappingURL=index.js.map