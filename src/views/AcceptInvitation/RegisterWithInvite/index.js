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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@src/auth");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var react_router_dom_1 = require("react-router-dom");
var displayInvitedAs_1 = require("@src/lib/displayInvitedAs");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var register_with_invitation_token_graphql_1 = require("@src/queries/register-with-invitation-token.graphql");
var accept_invitation_graphql_1 = require("@src/queries/accept-invitation.graphql");
var formik_1 = require("formik");
var Loader_1 = require("@src/components/Loader");
var react_1 = require("react");
var React = require("react");
var react_apollo_1 = require("react-apollo");
var yup = require("yup");
require("./style.scss");
var hasRole_1 = require("@src/lib/hasRole");
var FinishRegistrationForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement(formik_1.Field, { name: "name", label: "Name", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "email", label: "Email", type: "email", component: Input_1.default, disabled: true }),
    React.createElement(formik_1.Field, { name: "password", label: "New Password", type: "password", component: Input_1.default }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Finish Registration"))); };
var RegisterWithInvite = /** @class */ (function (_super) {
    __extends(RegisterWithInvite, _super);
    function RegisterWithInvite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.validationSchema = yup.object().shape({
            name: yup.string(),
            password: yup
                .string()
                .required('Password is required')
                .min(6, 'Password should at least be 6 characters long')
        });
        _this.handleAcceptInvitation = function (mutationFunc) { return function () {
            mutationFunc({
                variables: { token: _this.props.invitation.token },
                update: function (cache, _a) {
                    var acceptInvitation = _a.data.acceptInvitation;
                    cache.writeQuery({
                        query: current_user_graphql_1.default,
                        data: {
                            currentUser: __assign({}, acceptInvitation.user, { token: acceptInvitation.token })
                        }
                    });
                }
            }).then(function (res) {
                auth_1.loginLocal(res.data.acceptInvitation.token);
            });
        }; };
        _this.handleRegister = function (mutationFunc) { return function (values, _a) {
            var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            setSubmitting(true);
            mutationFunc({
                variables: values,
                update: function (cache, _a) {
                    var registerWithInvitationToken = _a.data.registerWithInvitationToken;
                    cache.writeQuery({
                        query: current_user_graphql_1.default,
                        data: {
                            currentUser: __assign({}, registerWithInvitationToken.user, { token: registerWithInvitationToken.token })
                        }
                    });
                }
            })
                .then(function (res) {
                auth_1.loginLocal(res.data.registerWithInvitationToken.token);
            })
                .catch(function (err) {
                setSubmitting(false);
                setStatus(err);
            });
        }; };
        return _this;
    }
    RegisterWithInvite.prototype.render = function () {
        var _this = this;
        var _a = this.props, invite = _a.invitation, user = _a.user;
        if (!invite || (user && user.email !== invite.invitedEmail)) {
            return (React.createElement("div", { styleName: "error-msg" },
                React.createElement("h1", null, "Oops! You are not invited!"),
                React.createElement("p", null, "Either your invitation has expired, or it has been revoked. Please contact the person who sent you the invitation for clarification")));
        }
        if (user && hasRole_1.default(user)(invite.invitedAs)) {
            return React.createElement(react_router_dom_1.Redirect, { to: "/dashboard" });
        }
        return (React.createElement("div", null,
            React.createElement("h1", null, "Welcome to Skill2Skills!"),
            React.createElement("p", null,
                "You have been invited to join Skill2Skills platform by",
                ' ',
                React.createElement("b", null,
                    invite.invitedBy.name,
                    "(",
                    invite.invitedBy.email,
                    ")"),
                "to join as a ",
                React.createElement("b", null, displayInvitedAs_1.default(invite.invitedAs)),
                "."),
            React.createElement("p", null,
                "You are invited to join training center ",
                React.createElement("b", null, invite.trainingCenter.name),
                "."),
            !this.props.user && (React.createElement("div", null,
                React.createElement("p", null,
                    "To accept the invitation, you need to register with Skill2Skills. Your username will be",
                    React.createElement("b", null,
                        " ",
                        invite.invitedEmail),
                    ". Please enter your password in the field below, and click on",
                    React.createElement("i", null, "Register"),
                    " button to finish registration."),
                React.createElement(react_apollo_1.Mutation, { mutation: register_with_invitation_token_graphql_1.default }, function (mutationFunc, _a) {
                    var loading = _a.loading, error = _a.error;
                    return (React.createElement(formik_1.Formik, { initialValues: {
                            token: invite.token,
                            email: invite.invitedEmail,
                            name: '',
                            password: ''
                        }, validationSchema: _this.validationSchema, onSubmit: _this.handleRegister(mutationFunc), render: FinishRegistrationForm }));
                }))),
            this.props.user && (React.createElement(react_apollo_1.Mutation, { mutation: accept_invitation_graphql_1.default }, function (mutationFunc, _a) {
                var loading = _a.loading, error = _a.error;
                return (React.createElement("div", null,
                    React.createElement("div", { className: "btn-primary", onClick: _this.handleAcceptInvitation(mutationFunc) },
                        "Accept new role as a ",
                        displayInvitedAs_1.default(invite.invitedAs)),
                    React.createElement(Loader_1.default, { isVisible: loading }),
                    error && React.createElement(ApolloError_1.default, { error: error })));
            }))));
    };
    return RegisterWithInvite;
}(react_1.Component));
exports.default = RegisterWithInvite;
//# sourceMappingURL=index.js.map