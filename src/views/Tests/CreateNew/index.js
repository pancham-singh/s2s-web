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
var Loader_1 = require("@src/components/Loader");
var answers_listing_graphql_1 = require("@src/queries/answers-listing.graphql");
var assesment_questions_graphql_1 = require("@src/queries/assesment-questions.graphql");
var assessment_result_details_graphql_1 = require("@src/queries/assessment-result-details.graphql");
var create_assessment_result_graphql_1 = require("@src/queries/create-assessment-result.graphql");
var formik_1 = require("formik");
var React = require("react");
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
var yup = require("yup");
var ApolloError_1 = require("@src/components/ApolloError");
var react_toastify_1 = require("react-toastify");
require("./style.scss");
var validationSchema = yup.object().shape({
    answerId: yup
        .string()
        .required('Name is required'),
    question: yup.string(),
    assessment: yup.string(),
    isCorrect: yup.boolean()
});
var TestResult = function (props) { return (React.createElement("div", null,
    React.createElement("div", { styleName: "answer-list-item" },
        "Correct Answers: ",
        props.data.correctCount),
    React.createElement("div", { styleName: "answer-list-item" },
        "Incorrect Answers: ",
        props.data.incorrectCount),
    React.createElement("div", { styleName: "answer-list-item" },
        "Completed Answers:",
        props.data.completedCount),
    React.createElement("div", { styleName: "answer-list-item" },
        "Pending Answers: ",
        props.data.pendingCount))); };
var PostAnswers = function (props) { return (React.createElement(react_apollo_1.Mutation, { mutation: create_assessment_result_graphql_1.default }, function (createAssessmentResult, _a) {
    var loading = _a.loading, error = _a.error;
    return (React.createElement("div", null,
        React.createElement(Loader_1.default, { isVisible: loading }),
        React.createElement("h2", null,
            "=> ",
            props.question.body),
        React.createElement(formik_1.Formik, { initialValues: props.initialValues, onSubmit: function (values, actions) {
                console.log('values', values);
                props.onSubmit(createAssessmentResult, values, actions);
            }, render: function (_a) {
                var errors = _a.errors, touched = _a.touched, isSubmitting = _a.isSubmitting, values = _a.values, handleChange = _a.handleChange;
                return (React.createElement(formik_1.Form, null,
                    React.createElement(react_apollo_1.Query, { query: answers_listing_graphql_1.default, variables: { question: props.question.id } }, function (_a) {
                        var data = _a.data, error = _a.error, loading = _a.loading;
                        if (loading) {
                            return React.createElement(Loader_1.default, { isVisible: loading });
                        }
                        if (error) {
                            return React.createElement(ApolloError_1.default, { error: error });
                        }
                        return (React.createElement("div", null, !loading && !error && data.answers.map(function (ans) { return (React.createElement("div", { styleName: "answer-list-item", key: ans.id },
                            React.createElement("label", null,
                                React.createElement("input", { key: ans.id, name: "isCorrect", onChange: function (e) {
                                        values.answer.isCorrect = ans.isCorrect;
                                        values.answer.id = ans.id;
                                        values.answer.body = ans.body;
                                        values.answer.question = props.question.id;
                                    }, type: "radio", styleName: 'checkbox-form-group' }),
                                React.createElement("span", null,
                                    " ",
                                    ans.body)))); })));
                    }),
                    React.createElement("button", { type: "submit", className: "btn-primary", disabled: isSubmitting }, "Submit")));
            } })));
})); };
var CreateTest = /** @class */ (function (_super) {
    __extends(CreateTest, _super);
    function CreateTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { next: 0, qustions: [], answer: {}, currentQuestion: IQuestion, count: 0, isCorrect: false };
        _this.questions = [];
        _this.result = {
            correctCount: 0,
            incorrectCount: 0,
            completedCount: 0,
            pendingCount: 0
        };
        _this.testName = '';
        _this.updateResult = function (result) {
            _this.result.pendingCount = (_this.questions.length - _this.state.next);
            _this.result.completedCount = _this.state.next;
            _this.result.incorrectCount = result.isCorrect ? _this.result.incorrectCount : _this.result.incorrectCount + 1;
            _this.result.correctCount = result.isCorrect ? _this.result.correctCount + 1 : _this.result.correctCount;
        };
        _this.handleCreateAssessmentResult = function (mutation, values, actions) {
            console.log('post values===', values);
            _this.updateResult({ isCorrect: values.answer.isCorrect });
            values.correctCount = _this.result.correctCount;
            values.incorrectCount = _this.result.incorrectCount;
            values.pendingCount = _this.result.pendingCount;
            values.completedCount = _this.result.pendingCount;
            actions.setSubmitting(true);
            mutation({
                variables: values,
                update: function (cache, _a) {
                    var assessmentResult = _a.data.createAssessmentResult;
                    // const { assessments } = cache.readQuery({ query: ASSESSMENT_LISTING });
                    // cache.writeQuery({
                    //   query: ASSESSMENT_LISTING,
                    //   data: { assessments: assessments.concat    (assessmentResult) }
                    // });
                }
            })
                .then(function (res) {
                actions.setSubmitting(false);
                actions.resetForm();
                react_toastify_1.toast('Created new Assessment', { type: 'success' });
                if (_this.state.next === _this.questions.length) {
                    location.href = "/tests/" + _this.props.match.params.testId;
                }
                _this.next();
            })
                .catch(function (err) {
                actions.setSubmitting(false);
                actions.setStatus(err);
            });
        };
        _this.getTests = function (questions) {
            _this.questions = questions;
            console.log(_this.questions);
        };
        _this.next = function () {
            var size = _this.questions.length;
            if (_this.state.next <= size) {
                _this.setState({
                    currentQuestion: _this.questions[_this.state.next],
                    next: _this.state.next + 1
                });
            }
        };
        return _this;
    }
    CreateTest.prototype.render = function () {
        var _this = this;
        var testId = this.props.match.params.testId;
        var initialValues = {
            answer: {
                assessment: this.props.match.params.testId,
                id: '2',
                question: 0,
                body: '',
                isCorrect: false
            },
            assessment: this.props.match.params.testId,
            correctCount: this.result.correctCount,
            incorrectCount: this.result.incorrectCount,
            completedCount: this.result.completedCount,
            pendingCount: this.result.pendingCount
        };
        return (React.createElement("div", { styleName: "container" },
            React.createElement("div", { styleName: "content" },
                React.createElement(react_apollo_1.Query, { query: assessment_result_details_graphql_1.default, variables: { assessment: testId } }, function (_a) {
                    var data = _a.data, loading = _a.loading, error = _a.error;
                    console.log('assessment data', data);
                    return (React.createElement("div", null,
                        !loading && !error && data.assessmentResults.length > 0 &&
                            React.createElement("div", null,
                                React.createElement("h1", null, data.assessmentResults[0].assessment.name),
                                React.createElement(TestResult, { data: data.assessmentResults[0] })),
                        !loading && !error && data.assessmentResults.length <= 0 &&
                            React.createElement(react_apollo_1.Query, { query: assesment_questions_graphql_1.default, variables: { id: testId } }, function (_a) {
                                var data = _a.data, loading = _a.loading, error = _a.error;
                                return (React.createElement("div", null,
                                    React.createElement(Loader_1.default, { isVisible: loading }),
                                    error && React.createElement(ApolloError_1.default, { error: error }),
                                    !loading && !error &&
                                        _this.getTests(data.assessment.questions),
                                    !loading && !error &&
                                        React.createElement("div", null,
                                            React.createElement("h1", null, data.assessment.name),
                                            React.createElement(PostAnswers, { initialValues: initialValues, question: _this.state.currentQuestion || data.assessment.questions[0], onSubmit: _this.handleCreateAssessmentResult }))));
                            })));
                }))));
    };
    return CreateTest;
}(react_1.Component));
exports.default = CreateTest;
//# sourceMappingURL=index.js.map