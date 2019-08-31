"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var yup = require("yup");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var topic_listing_graphql_1 = require("@src/queries/topic-listing.graphql");
var create_topic_graphql_1 = require("@src/queries/create-topic.graphql");
var update_topic_graphql_1 = require("@src/queries/update-topic.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
require("./style.scss");
var ImageUpload_1 = require("@src/components/Form/ImageUpload");
var handleCreateSubmit = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var createTopic = _a.data.createTopic;
            var topics = cache.readQuery({
                query: topic_listing_graphql_1.default,
                variables: { moduleId: values.moduleId }
            }).topics;
            cache.writeQuery({
                query: topic_listing_graphql_1.default,
                variables: { moduleId: values.moduleId },
                data: { topics: topics.concat(createTopic) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new topic!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateSubmit = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({ variables: values })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated topic!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var validationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required')
        .max(500, 'Name can not be longer than 500 characters'),
    description: yup.string().required('Description is required'),
    coverImage: yup.string().required('Cover image is required'),
    moduleId: yup.string().required('Module ID can not be empty'),
    pointsPractical: yup
        .number()
        .required('Practical exam points are required')
        .min(0),
    pointsTheory: yup
        .number()
        .required('Theory exam points are required')
        .min(0)
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Topic"),
    React.createElement(formik_1.Field, { name: "moduleId", component: "input", type: "hidden" }),
    React.createElement(formik_1.Field, { name: "name", label: "Name of the Topic", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "description", label: "Description", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "coverImage", label: "Cover Image", component: ImageUpload_1.default }),
    React.createElement(formik_1.Field, { name: "pointsPractical", label: "Practical Exam Points", type: "number", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "pointsTheory", label: "Theory Exam Points", type: "number", component: Input_1.default }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewTopic = function (props) {
    var initialValues = props.topic
        ? {
            id: props.topic.id,
            name: props.topic.name,
            description: props.topic.description,
            coverImage: props.topic.coverImage,
            moduleId: props.topic.module.id,
            pointsTheory: props.topic.pointsTheory,
            pointsPractical: props.topic.pointsPractical
        }
        : {
            name: '',
            description: '',
            coverImage: '',
            moduleId: props.match.params.moduleId,
            pointsTheory: 0,
            pointsPractical: 0
        };
    var handleSubmit = props.topic ? handleUpdateSubmit : handleCreateSubmit;
    return (React.createElement(react_apollo_1.Mutation, { mutation: props.topic ? update_topic_graphql_1.default : create_topic_graphql_1.default }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit(mutationFunc), render: InnerForm }));
    }));
};
exports.default = CreateNewTopic;
//# sourceMappingURL=index.js.map