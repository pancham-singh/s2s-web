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
var react_apollo_1 = require("react-apollo");
var BreadCrumbs_1 = require("@src/components/BreadCrumbs");
var topic_details_graphql_1 = require("@src/queries/topic-details.graphql");
var topic_listing_graphql_1 = require("@src/queries/topic-listing.graphql");
var delete_topic_graphql_1 = require("@src/queries/delete-topic.graphql");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
var Modal_1 = require("@src/components/Modal");
var CreateNew_1 = require("@src/views/Topics/CreateNew");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var Listing_1 = require("@src/views/Questions/Listing");
var QuestionDetails_1 = require("@src/views/Questions/QuestionDetails");
require("./style.scss");
var react_1 = require("react");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var topics = cache.readQuery({ query: topic_listing_graphql_1.default, variables: variables }).topics;
            cache.writeQuery({
                query: topic_listing_graphql_1.default,
                variables: variables,
                data: { topics: topics.filter(function (c) { return String(c.id) !== String(variables.id); }) }
            });
        }
    });
};
var TopicDetails = /** @class */ (function (_super) {
    __extends(TopicDetails, _super);
    function TopicDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isEditing: false, isDeleting: false };
        _this.showDeletePrompt = function () { return _this.setState({ isDeleting: true }); };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false }); };
        _this.showEditForm = function () { return _this.setState({ isEditing: true }); };
        _this.hideEditForm = function () { return _this.setState({ isEditing: false }); };
        _this.handleSelectQuestion = function (q) {
            return _this.state.selectedQuestion && q.id === _this.state.selectedQuestion.id
                ? _this.setState({ selectedQuestion: null })
                : _this.setState({ selectedQuestion: q });
        };
        return _this;
    }
    TopicDetails.prototype.render = function () {
        var _this = this;
        var t = this.props.topic;
        var moduleId = this.props.topic.module.id;
        var courseId = this.props.topic.module.course.id;
        if (!t) {
            return React.createElement("h1", null, "Topic Not Found");
        }
        return (React.createElement("div", { styleName: "content" },
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this topic?", subtitle: "This will delete the topic, all its questions and everything therein.", mutation: delete_topic_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.props.topic.id, moduleId: moduleId }, onDelete: function () { return _this.props.history.push("/courses/" + courseId + "/modules/" + moduleId); }, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement(Modal_1.default, { isVisible: this.state.isEditing, onClose: this.hideEditForm },
                React.createElement(CreateNew_1.default, __assign({}, this.props, { topic: this.props.topic }))),
            React.createElement("h1", { styleName: "header" },
                t.name,
                React.createElement("div", { styleName: "controls" },
                    React.createElement("i", { styleName: "edit", title: "Edit", onClick: this.showEditForm }),
                    React.createElement("i", { styleName: "delete", title: "Delete", onClick: this.showDeletePrompt }))),
            React.createElement("div", null, t.description),
            React.createElement("div", { styleName: "questions" },
                React.createElement("div", { styleName: "listing" },
                    React.createElement(Listing_1.default, __assign({}, this.props, { onSelect: this.handleSelectQuestion, selectedQuestion: this.state.selectedQuestion }))),
                this.state.selectedQuestion && (React.createElement("div", { styleName: "selected-question-section" },
                    React.createElement(QuestionDetails_1.default, { questionId: String(this.state.selectedQuestion.id), onDelete: this.handleSelectQuestion }))))));
    };
    return TopicDetails;
}(react_1.Component));
var Topic = function (props) { return (React.createElement(react_apollo_1.Query, { query: topic_details_graphql_1.default, variables: { id: props.match.params.topicId } }, function (_a) {
    var loading = _a.loading, error = _a.error, data = _a.data;
    var moduleId = props.match.params.moduleId;
    var crumbs = {
        Courses: '/courses'
    };
    if (data && data.topic) {
        var courseId = data.topic.module.course.id;
        var moduleId_1 = data.topic.module.id;
        crumbs[data.topic.module.course.name] = "/courses/" + courseId;
        crumbs[data.topic.module.name] = "/courses/" + courseId + "/modules/" + moduleId_1;
        crumbs[data.topic.name] = null;
    }
    return (React.createElement("div", { styleName: "container" },
        React.createElement(BreadCrumbs_1.default, { crumbs: crumbs }),
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(TopicDetails, __assign({ topic: data.topic }, props))));
})); };
exports.default = Topic;
//# sourceMappingURL=index.js.map