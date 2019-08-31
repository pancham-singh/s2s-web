"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var yup = require("yup");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var create_module_graphql_1 = require("@src/queries/create-module.graphql");
var update_module_graphql_1 = require("@src/queries/update-module.graphql");
var module_listing_graphql_1 = require("@src/queries/module-listing.graphql");
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
            var createModule = _a.data.createModule;
            var modules = cache.readQuery({
                query: module_listing_graphql_1.default,
                variables: { courseId: values.courseId }
            }).modules;
            cache.writeQuery({
                query: module_listing_graphql_1.default,
                variables: { courseId: values.courseId },
                data: { modules: modules.concat(createModule) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new module!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateSubmit = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting;
    setSubmitting(true);
    mutation({ variables: values })
        .then(function (res) {
        setSubmitting(false);
        react_toastify_1.toast('Updated module!', { type: 'success' });
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
    courseId: yup.string().required('Course ID can not be empty')
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Add new Module"),
    React.createElement(formik_1.Field, { name: "courseId", component: "input", type: "hidden" }),
    React.createElement(formik_1.Field, { name: "name", label: "Name of the Module", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "description", label: "Description", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "coverImage", label: "Cover Image", component: ImageUpload_1.default }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewModule = function (props) {
    var initialValues = props.module
        ? {
            id: props.module.id,
            name: props.module.name,
            description: props.module.description,
            coverImage: props.module.coverImage,
            courseId: props.module.course.id
        }
        : {
            name: '',
            description: '',
            coverImage: '',
            courseId: props.match.params.courseId
        };
    var handleSubmit = props.module ? handleUpdateSubmit : handleCreateSubmit;
    return (React.createElement(react_apollo_1.Mutation, { mutation: props.module ? update_module_graphql_1.default : create_module_graphql_1.default }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit(mutationFunc), render: InnerForm }));
    }));
};
exports.default = CreateNewModule;
//# sourceMappingURL=index.js.map