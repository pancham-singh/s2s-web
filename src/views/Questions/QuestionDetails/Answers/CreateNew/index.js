"use strict";
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
var yup = require("yup");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var question_details_graphql_1 = require("@src/queries/question-details.graphql");
var create_answer_graphql_1 = require("@src/queries/create-answer.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var AttachmentsFieldArray_1 = require("@src/components/AttachmentsFieldArray");
require("./style.scss");
var handleSubmit = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var createAnswer = _a.data.createAnswer;
            var question = cache.readQuery({
                query: question_details_graphql_1.default,
                variables: { id: values.questionId }
            }).question;
            cache.writeQuery({
                query: question_details_graphql_1.default,
                variables: { id: values.questionId },
                data: { question: __assign({}, question, { answers: (question.answers || []).concat(createAnswer) }) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new answer!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var validationSchema = yup.object().shape({
    body: yup.string().required('Answer body is required'),
    isCorrect: yup.boolean().default(false),
    attachments: yup.array().of(yup.object().shape({
        type: yup
            .string()
            .oneOf(['image'])
            .required(),
        url: yup
            .string()
            .url('Attachment must a valid URL to an image')
            .required('Attachment URL is required')
    })),
    questionId: yup.string().required('Question ID can not be empty')
});
var InnerForm = function (_a) {
    var formData = _a.formData, onClose = _a.onClose;
    return (React.createElement(formik_1.Form, { styleName: "form-container" },
        React.createElement(formik_1.Field, { name: "questionId", component: "input", type: "hidden" }),
        React.createElement(formik_1.Field, { name: "body", label: "Answer Body", component: Input_1.default }),
        React.createElement(formik_1.Field, { name: "isCorrect", label: "Is correct answer?", type: "checkbox", component: Input_1.default, classNames: { wrapper: 'checkbox-form-group' } }),
        React.createElement(formik_1.FieldArray, { name: "attachments", render: function (ops) { return (React.createElement(AttachmentsFieldArray_1.default, { values: formData.values.attachments, name: "attachments", fieldArrayOps: ops })); } }),
        formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
        React.createElement("button", { styleName: "form-btn", className: "btn-primary" }, "Create"),
        React.createElement("button", { styleName: "form-btn", className: "btn-danger", type: "button", onClick: onClose }, "Close")));
};
var CreateNewAnswer = function (props) { return (React.createElement(react_apollo_1.Mutation, { mutation: create_answer_graphql_1.default }, function (createAnswer, _a) {
    var loading = _a.loading, error = _a.error;
    return (React.createElement(formik_1.Formik, { initialValues: {
            body: '',
            isCorrect: false,
            questionId: props.question.id,
            attachments: []
        }, validationSchema: validationSchema, onSubmit: handleSubmit(createAnswer), render: function (formProps) { return (React.createElement(InnerForm, { formData: formProps, onClose: props.onClose })); } }));
})); };
exports.default = CreateNewAnswer;
//# sourceMappingURL=index.js.map