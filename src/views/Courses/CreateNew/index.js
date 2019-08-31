"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var yup = require("yup");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var create_course_graphql_1 = require("@src/queries/create-course.graphql");
var update_course_graphql_1 = require("@src/queries/update-course.graphql");
var course_listing_graphql_1 = require("@src/queries/course-listing.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
require("./style.scss");
var Select_1 = require("@src/components/Form/Select");
var ImageUpload_1 = require("@src/components/Form/ImageUpload");
var handleCreateCourse = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var createCourse = _a.data.createCourse;
            var courses = cache.readQuery({ query: course_listing_graphql_1.default }).courses;
            cache.writeQuery({
                query: course_listing_graphql_1.default,
                data: { courses: courses.concat(createCourse) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new course', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateCourse = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated course!', { type: 'success' });
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
    category: yup.string().oneOf(['domain', 'non-domain'])
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Add new Course"),
    React.createElement(formik_1.Field, { name: "name", label: "Name of the Course", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "description", label: "Description", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "coverImage", label: "Cover Image", component: ImageUpload_1.default }),
    React.createElement(formik_1.Field, { name: "category", label: "Category of Course", component: Select_1.default, options: [
            {
                title: 'Domain',
                value: 'domain'
            },
            {
                title: 'Non-Domain',
                value: 'non-domain'
            }
        ] }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewCourse = function (props) {
    var initialValues = props.course
        ? {
            id: props.course.id,
            name: props.course.name,
            description: props.course.description,
            coverImage: props.course.coverImage,
            category: props.course.category
        }
        : {
            name: '',
            description: '',
            coverImage: '',
            category: 'domain'
        };
    var mutation = props.course ? update_course_graphql_1.default : create_course_graphql_1.default;
    var handleMutation = props.course ? handleUpdateCourse : handleCreateCourse;
    return (React.createElement(react_apollo_1.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm }));
    }));
};
exports.default = CreateNewCourse;
//# sourceMappingURL=index.js.map