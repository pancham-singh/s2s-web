"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_apollo_1 = require("react-apollo");
var Modal_1 = require("@src/components/Modal");
var AddNewItemTile_1 = require("@src/components/AddNewItemTile");
var CreateNew_1 = require("@src/views/Topics/CreateNew");
var CourseTile_1 = require("@src/components/CourseTile");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var topic_listing_graphql_1 = require("@src/queries/topic-listing.graphql");
require("./style.scss");
var routePrefix = function (courseId, moduleId) { return "/modules/" + moduleId + "/topics"; };
var TopicListing_ = /** @class */ (function (_super) {
    __extends(TopicListing_, _super);
    function TopicListing_() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAddingTopic: false };
        _this.startAddingTopic = function () { return _this.setState({ isAddingTopic: true }); };
        _this.stopAddingModule = function () { return _this.setState({ isAddingTopic: false }); };
        return _this;
    }
    TopicListing_.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Topics"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAddingTopic, onClose: this.stopAddingModule },
                React.createElement(CreateNew_1.default, __assign({}, this.props))),
            React.createElement("div", { styleName: "tiles" },
                React.createElement(AddNewItemTile_1.default, { title: "Add New Topic", onClick: this.startAddingTopic }),
                this.props.topics.map(function (t) { return (React.createElement(react_router_dom_1.Link, { styleName: "tile", key: t.id, to: routePrefix(_this.props.courseId, _this.props.moduleId) + "/" + t.id },
                    React.createElement(CourseTile_1.default, { course: t }))); }))));
    };
    return TopicListing_;
}(react_1.Component));
var TopicListing = function (props) { return (React.createElement(react_apollo_1.Query, { query: topic_listing_graphql_1.default, variables: { moduleId: props.match.params.moduleId } }, function (_a) {
    var data = _a.data, error = _a.error, loading = _a.loading;
    if (loading) {
        return React.createElement(Loader_1.default, { isVisible: loading });
    }
    if (error) {
        return React.createElement(ApolloError_1.default, { error: error });
    }
    return (React.createElement(TopicListing_, __assign({}, props, { topics: data.topics, moduleId: props.match.params.moduleId, courseId: props.match.params.courseId })));
})); };
exports.default = TopicListing;
//# sourceMappingURL=index.js.map