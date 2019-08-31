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
var question_listing_graphql_1 = require("@src/queries/question-listing.graphql");
var create_question_graphql_1 = require("@src/queries/create-question.graphql");
var update_question_graphql_1 = require("@src/queries/update-question.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var AttachmentsFieldArray_1 = require("@src/components/AttachmentsFieldArray");
var AnswersFieldArray_1 = require("@src/components/AnswersFieldArray");
var Select_1 = require("@src/components/Form/Select");
require("./style.scss");
var handleCreate = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var createQuestion = _a.data.createQuestion;
            var questions = cache.readQuery({
                query: question_listing_graphql_1.default,
                variables: { topicId: values.topicId }
            }).questions;
            cache.writeQuery({
                query: question_listing_graphql_1.default,
                variables: { topicId: values.topicId },
                data: { questions: questions.concat(createQuestion) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new question!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdate = function (mutation) { return function (variables, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    // remove __typename field because graphql won't accept it on the server
    var removeApollosBullshit = function (x) {
        return Object.keys(x).reduce(function (accum, key) {
            if (key !== '__typename') {
                accum[key] = x[key];
            }
            return accum;
        }, {});
    };
    variables.answers = (variables.answers || []).map(function (a) {
        a = removeApollosBullshit(a);
        a.attachments = (a.attachments || []).map(removeApollosBullshit);
        return a;
    });
    variables.attachments = (variables.attachments || []).map(removeApollosBullshit);
    mutation({
        variables: variables,
        update: function (cache, _a) {
            var updateQuestion = _a.data.updateQuestion;
            var oldQuestion = cache.readQuery({ query: question_details_graphql_1.default, variables: variables }).question;
            var question = __assign({}, oldQuestion, updateQuestion);
            cache.writeQuery({
                query: question_details_graphql_1.default,
                variables: variables,
                data: { question: question }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        react_toastify_1.toast('Successfully updated question!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var attachmentsSchema = yup
    .array()
    .of(yup.object().shape({
    type: yup
        .string()
        .oneOf(['image'])
        .required(),
    url: yup.string().required('Required')
}))
    .nullable(true);
var validationSchema = yup.object().shape({
    body: yup.string().required('Question body is required'),
    type: yup
        .string()
        .oneOf(['theory', 'practical'])
        .required('Question type is required'),
    points: yup
        .number()
        .required('Question points are required')
        .min(0),
    attachments: attachmentsSchema,
    topicId: yup.string().required('Topic ID can not be empty'),
    answers: yup.array().of(yup.object().shape({
        body: yup.string().required('Answer body is required'),
        isCorrect: yup.boolean(),
        attachments: attachmentsSchema
    }))
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Question"),
    React.createElement(formik_1.Field, { name: "topicId", component: "input", type: "hidden" }),
    React.createElement(formik_1.Field, { name: "body", label: "Question Body", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "type", label: "Type of Question", component: Select_1.default, options: [{ title: 'Practical', value: 'practical' }, { title: 'Theory', value: 'theory' }] }),
    React.createElement(formik_1.Field, { name: "points", label: "Question Points", type: "number", component: Input_1.default }),
    React.createElement(formik_1.FieldArray, { name: "attachments", render: function (ops) { return (React.createElement(AttachmentsFieldArray_1.default, { values: formData.values.attachments, name: "attachments", fieldArrayOps: ops })); } }),
    React.createElement("label", { className: "label" }, "Answers"),
    React.createElement(formik_1.FieldArray, { name: "answers", render: function (ops) { return (React.createElement(AnswersFieldArray_1.default, { values: formData.values.answers, name: "answers", fieldArrayOps: ops })); } }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewQuestion = function (props) {
    var initialValues = props.question
        ? {
            id: props.question.id,
            body: props.question.body,
            points: props.question.points,
            type: props.question.type,
            topicId: props.question.topic.id,
            attachments: props.question.attachments,
            answers: props.question.answers
        }
        : {
            body: '',
            points: 0,
            type: 'theory',
            topicId: props.topicId,
            attachments: [],
            answers: []
        };
    var handleMutation = props.question ? handleUpdate : handleCreate;
    return (React.createElement(react_apollo_1.Mutation, { mutation: props.question ? update_question_graphql_1.default : create_question_graphql_1.default }, function (mutation, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutation), render: InnerForm }));
    }));
};
exports.default = CreateNewQuestion;
//# sourceMappingURL=index.js.map