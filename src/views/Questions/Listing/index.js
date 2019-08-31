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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
var AddNewItemRow_1 = require("@src/components/AddNewItemRow");
var ApolloError_1 = require("@src/components/ApolloError");
var Loader_1 = require("@src/components/Loader");
var Modal_1 = require("@src/components/Modal");
var CreateNew_1 = require("@src/views/Questions/CreateNew");
var question_listing_graphql_1 = require("@src/queries/question-listing.graphql");
require("./style.scss");
var routePrefix = function (topicId) { return "/topics/" + topicId + "/questions"; };
var QuestionListing = /** @class */ (function (_super) {
    __extends(QuestionListing, _super);
    function QuestionListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAddingQuestion: false };
        _this.startAddingQuestion = function () { return _this.setState({ isAddingQuestion: true }); };
        _this.stopAddingQuestion = function () { return _this.setState({ isAddingQuestion: false }); };
        return _this;
    }
    QuestionListing.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Questions"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAddingQuestion, onClose: this.stopAddingQuestion },
                React.createElement(CreateNew_1.default, { topicId: this.props.topicId })),
            React.createElement("ul", { styleName: "listing" },
                React.createElement(AddNewItemRow_1.default, { title: "Add new Question", onClick: this.startAddingQuestion }),
                this.props.questions.map(function (q) { return (React.createElement("li", { key: q.id, styleName: _this.props.selectedQuestion && q.id === _this.props.selectedQuestion.id
                        ? 'selected-question-list-item'
                        : 'question-list-item', onClick: function () { return _this.props.onSelect(q); } }, q.body)); }))));
    };
    return QuestionListing;
}(react_1.Component));
var QuestionListingWithData = function (props) { return (React.createElement(react_apollo_1.Query, { query: question_listing_graphql_1.default, variables: { topicId: props.match.params.topicId } }, function (_a) {
    var data = _a.data, error = _a.error, loading = _a.loading;
    if (loading) {
        return React.createElement(Loader_1.default, { isVisible: loading });
    }
    if (error) {
        return React.createElement(ApolloError_1.default, { error: error });
    }
    return (React.createElement(QuestionListing, { questions: data.questions, topicId: props.match.params.topicId, onSelect: props.onSelect, selectedQuestion: props.selectedQuestion }));
})); };
exports.default = QuestionListingWithData;
//# sourceMappingURL=index.js.map