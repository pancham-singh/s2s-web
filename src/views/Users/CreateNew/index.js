"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var yup = require("yup");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var create_user_graphql_1 = require("@src/queries/create-user.graphql");
var user_listing_graphql_1 = require("@src/queries/user-listing.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
require("./style.scss");
var Select_1 = require("@src/components/Form/Select");
var handleCreateUser = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var user = _a.data.createUser.user;
            var users = cache.readQuery({ query: user_listing_graphql_1.default }).users;
            cache.writeQuery({
                query: user_listing_graphql_1.default,
                data: { users: users.concat(user) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new user', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateUser = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated user!', { type: 'success' });
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
        .max(140, 'Name can not be longer than 140 characters'),
    email: yup
        .string()
        .email()
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password should at least be 6 characters long')
        .required('Email is required'),
    role: yup
        .string()
        .required('Role is required')
        .oneOf(['admin', 'pia', 'centerIncharge', 'teacher', 'student'])
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Add new User"),
    React.createElement(formik_1.Field, { name: "name", label: "Name of the User", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "email", label: "Email", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "password", label: "Password", type: "password", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "role", label: "Role", component: Select_1.default, options: [{ title: 'Admin', value: 'admin' }, { title: 'Pia', value: 'pia' }] }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewUser = function (props) {
    var initialValues = props.user
        ? {
            id: props.user.id,
            name: props.user.name,
            email: props.user.email,
            password: '',
            role: props.user.roles.length ? props.user.roles[0].name : 'student'
        }
        : {
            name: '',
            email: '',
            role: 'pia',
            password: ''
        };
    var mutation = create_user_graphql_1.default;
    var handleMutation = handleCreateUser;
    return (React.createElement(react_apollo_1.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm }));
    }));
};
exports.default = CreateNewUser;
//# sourceMappingURL=index.js.map