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
var react_apollo_1 = require("react-apollo");
var question_details_graphql_1 = require("@src/queries/question-details.graphql");
var question_listing_graphql_1 = require("@src/queries/question-listing.graphql");
var delete_question_graphql_1 = require("@src/queries/delete-question.graphql");
var Loader_1 = require("@src/components/Loader");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
var ApolloError_1 = require("@src/components/ApolloError");
require("./style.scss");
var Listing_1 = require("./Answers/Listing");
var CreateNew_1 = require("./Answers/CreateNew");
var CreateNew_2 = require("@src/views/Questions/CreateNew");
var Modal_1 = require("@src/components/Modal");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var questions = cache.readQuery({ query: question_listing_graphql_1.default, variables: variables }).questions;
            cache.writeQuery({
                query: question_listing_graphql_1.default,
                variables: variables,
                data: { questions: questions.filter(function (q) { return String(q.id) !== String(variables.id); }) }
            });
            cache.writeQuery({
                query: question_details_graphql_1.default,
                variables: variables,
                data: { question: null }
            });
        }
    });
};
var QuestionDetails = /** @class */ (function (_super) {
    __extends(QuestionDetails, _super);
    function QuestionDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isEditing: false,
            isDeleting: false,
            isAddingAnswer: false
        };
        _this.startAddingAnswer = function () { return _this.setState({ isAddingAnswer: true }); };
        _this.stopAddingAnswer = function () { return _this.setState({ isAddingAnswer: false }); };
        _this.showDeletePrompt = function () { return _this.setState({ isDeleting: true }); };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false }); };
        _this.showEditForm = function () { return _this.setState({ isEditing: true }); };
        _this.hideEditForm = function () { return _this.setState({ isEditing: false }); };
        return _this;
    }
    QuestionDetails.prototype.render = function () {
        var _this = this;
        var q = this.props.question;
        if (!q) {
            return React.createElement("h1", null, "Question Not Found");
        }
        var topicId = q.topic.id;
        var moduleId = q.topic.module.id;
        return (React.createElement("div", null,
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this Question?", subtitle: "This will delete the question, all its answers and everything therein.", mutation: delete_question_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: q.id, topicId: topicId }, onDelete: function () {
                    _this.hideDeletePrompt();
                    _this.props.onDelete(q);
                }, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement(Modal_1.default, { isVisible: this.state.isEditing, onClose: this.hideEditForm },
                React.createElement(CreateNew_2.default, __assign({}, this.props, { topicId: this.props.question.topic.id, question: this.props.question }))),
            React.createElement("h1", { styleName: "header" },
                q.body,
                React.createElement("div", { styleName: "controls" },
                    React.createElement("i", { styleName: "edit", title: "Edit", onClick: this.showEditForm }),
                    React.createElement("i", { styleName: "delete", title: "Delete", onClick: this.showDeletePrompt }))),
            React.createElement("div", { styleName: "answers" },
                React.createElement("h2", { styleName: "answers__heading" }, "Answers"),
                React.createElement("button", { className: "btn", onClick: this.startAddingAnswer }, "Add new Answer"),
                this.state.isAddingAnswer && (React.createElement("div", { styleName: "new-answer-form" },
                    React.createElement(CreateNew_1.default, { question: q, onClose: this.stopAddingAnswer }))),
                React.createElement(Listing_1.default, { answers: q.answers }))));
    };
    return QuestionDetails;
}(react_1.Component));
var Question = function (props) { return (React.createElement("div", { styleName: "container" },
    React.createElement(react_apollo_1.Query, { query: question_details_graphql_1.default, variables: { id: props.questionId } }, function (_a) {
        var loading = _a.loading, error = _a.error, data = _a.data;
        if (loading) {
            return React.createElement(Loader_1.default, { isVisible: true });
        }
        if (error) {
            return React.createElement(ApolloError_1.default, { error: error });
        }
        return React.createElement(QuestionDetails, { question: data.question, onDelete: props.onDelete });
    }))); };
exports.default = Question;
//# sourceMappingURL=index.js.map