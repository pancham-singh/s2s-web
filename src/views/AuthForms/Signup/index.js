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
var formik_1 = require("formik");
var react_apollo_1 = require("react-apollo");
var Input_1 = require("@src/components/Form/Input");
var register_graphql_1 = require("@src/queries/register.graphql");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
require("./style.scss");
var auth_1 = require("@src/auth");
var handleSubmit = function (mutation) { return function (values, _a) {
    var setSubmitting = _a.setSubmitting, setStatus = _a.setStatus, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var createUser = _a.data.createUser;
            cache.writeQuery({
                query: current_user_graphql_1.default,
                data: { currentUser: createUser.user }
            });
        }
    })
        .then(function (res) {
        auth_1.loginLocal(res.data.createUser.token);
    })
        .catch(function (err) {
        var hasGraphqlError = err.graphQLErrors.length;
        var error = (hasGraphqlError && err.graphQLErrors[0].message) || err.message;
        // Graphql error means token might be expired. Clear the token in that case
        if (hasGraphqlError) {
            auth_1.logoutLocal();
        }
        setSubmitting(false);
        setStatus(error);
    });
}; };
var validationSchema = yup.object().shape({
    name: yup.string(),
    email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    role: yup
        .string()
        .oneOf(['student', 'teacher'])
        .required(),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters in length')
        .required('Password is required')
});
var InnerForm = function (_a) {
    var formData = _a.formData;
    return (React.createElement(formik_1.Form, { styleName: "signup-form" },
        React.createElement(formik_1.Field, { name: "role", type: "hidden", component: Input_1.default }),
        React.createElement(formik_1.Field, { name: "name", component: Input_1.default, placeholder: "Name" }),
        React.createElement(formik_1.Field, { name: "email", type: "email", component: Input_1.default, placeholder: "Email" }),
        React.createElement(formik_1.Field, { name: "password", type: "password", component: Input_1.default, placeholder: "Password" }),
        React.createElement("button", { disabled: formData.isSubmitting, onClick: function () {
                formData.setValues(__assign({}, formData.values, { role: 'student' }));
                formData.submitForm();
            }, styleName: "student-signup-btn" }, "Signup as a Student"),
        React.createElement("button", { onClick: function () {
                formData.setValues(__assign({}, formData.values, { role: 'teacher' }));
                formData.submitForm();
            }, disabled: formData.isSubmitting, styleName: "teacher-signup-btn" }, "Signup as a teacher"),
        formData.status && React.createElement("div", { className: "form-error" }, formData.status)));
};
var SignupForm = function (props) {
    return (React.createElement("div", { styleName: "signup-container" },
        React.createElement(react_apollo_1.Mutation, { mutation: register_graphql_1.default }, function (register) { return (React.createElement(formik_1.Formik, { initialValues: { name: '', email: '', password: '', role: 'student' }, validationSchema: validationSchema, onSubmit: handleSubmit(register), render: function (formData) { return React.createElement(InnerForm, { formData: formData }); } })); })));
};
exports.default = SignupForm;
//# sourceMappingURL=index.js.map