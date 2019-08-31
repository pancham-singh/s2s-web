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
require("./style.scss");
var login_graphql_1 = require("@src/queries/login.graphql");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var Input_1 = require("@src/components/Form/Input");
var auth_1 = require("@src/auth");
var handleSubmit = function (mutation) { return function (values, _a) {
    var setSubmitting = _a.setSubmitting, setStatus = _a.setStatus, resetForm = _a.resetForm, props = _a.props;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var login = _a.data.login;
            cache.writeQuery({
                query: current_user_graphql_1.default,
                data: { currentUser: __assign({}, login.user, { token: login.token }) }
            });
        }
    })
        .then(function (res) {
        auth_1.loginLocal(res.data.login.token);
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
    email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters in length')
        .required('Password is required')
});
var InnerForm = function (_a) {
    var formData = _a.formData;
    return (React.createElement(formik_1.Form, { styleName: "login-form" },
        React.createElement(formik_1.Field, { name: "email", type: "email", placeholder: "Email", component: Input_1.default }),
        React.createElement(formik_1.Field, { type: "password", name: "password", placeholder: "Password", component: Input_1.default }),
        React.createElement("button", { styleName: "login-btn", disabled: formData.isSubmitting }, "Log In"),
        formData.status && React.createElement("div", { className: "form-error" }, formData.status)));
};
var LoginForm = function (props) { return (React.createElement("div", { styleName: "login-container" },
    React.createElement(react_apollo_1.Mutation, { mutation: login_graphql_1.default }, function (login, _a) {
        var data = _a.data;
        return (React.createElement(formik_1.Formik, { initialValues: { email: '', password: '' }, validationSchema: validationSchema, onSubmit: handleSubmit(login), render: function (formData) { return React.createElement(InnerForm, { formData: formData }); } }));
    }))); };
exports.default = LoginForm;
//# sourceMappingURL=index.js.map