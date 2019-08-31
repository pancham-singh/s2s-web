"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var Select_1 = require("@src/components/Form/Select");
var SelectFromQuery_1 = require("@src/components/Form/SelectFromQuery");
var Loader_1 = require("@src/components/Loader");
var batches_listing_graphql_1 = require("@src/queries/batches-listing.graphql");
var create_invitation_graphql_1 = require("@src/queries/create-invitation.graphql");
var invitation_listing_graphql_1 = require("@src/queries/invitation-listing.graphql");
var training_center_listing_graphql_1 = require("@src/queries/training-center-listing.graphql");
var fecha_1 = require("fecha");
var formik_1 = require("formik");
var React = require("react");
var react_apollo_1 = require("react-apollo");
var react_toastify_1 = require("react-toastify");
var yup = require("yup");
require("./style.scss");
var validInvitedAsRoles = ['student', 'teacher', 'centerIncharge'];
var handleCreateInvitation = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var invitation = _a.data.createInvitation;
            var invitations = cache.readQuery({ query: invitation_listing_graphql_1.default }).invitations;
            cache.writeQuery({
                query: invitation_listing_graphql_1.default,
                data: { invitations: invitations.concat(invitation) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new Invitation', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateInvitation = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated invitation!', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var validationSchema = yup.object().shape({
    invitedEmail: yup
        .string()
        .email()
        .required('Email is required'),
    validTill: yup.date().min(new Date(), 'Can not create already expired invitation'),
    invitedAs: yup.string().oneOf(validInvitedAsRoles),
    batchId: yup.string(),
    trainingCenterId: yup.string().required('Please select a Training Center')
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Invitation"),
    React.createElement(formik_1.Field, { name: "invitedEmail", label: "Invited User's Email", type: "email", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "validTill", type: "date", label: "Valid Till", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "trainingCenterId", label: "Training Center", component: SelectFromQuery_1.default, query: training_center_listing_graphql_1.default, displayOption: function (d) { return d.name + " " + (d.address && '(' + d.address + ')'); }, dataNodeName: "trainingCenters" }),
    React.createElement(formik_1.Field, { name: "invitedAs", component: Select_1.default, label: "Invite as", options: [
            { title: 'Student', value: 'student' },
            { title: 'Teacher', value: 'teacher' },
            { title: 'Center Incharge', value: 'centerIncharge' }
        ] }),
    formData.values.invitedAs === 'student' && (React.createElement(formik_1.Field, { name: "batchId", label: "Batch", component: SelectFromQuery_1.default, dataNodeName: "batches", query: batches_listing_graphql_1.default, displayOption: function (b) { return "" + b.name; } })),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewInvitation = function (props) {
    var initialValues = {
        id: undefined,
        invitedEmail: '',
        invitedAs: 'student',
        validTill: '',
        trainingCenterId: '',
        batchId: ''
    };
    var mutation = create_invitation_graphql_1.default;
    var handleMutation = handleCreateInvitation;
    if (props.invitation) {
        initialValues = {
            id: props.invitation.id,
            invitedEmail: props.invitation.invitedEmail,
            invitedAs: props.invitation.invitedAs,
            validTill: fecha_1.format(new Date(props.invitation.validTill), 'YYYY-MM-DD'),
            trainingCenterId: props.invitation.trainingCenter.id,
            batchId: props.invitation.batch && props.invitation.batch.id
        };
        mutation = UPDATE_INVITATION;
        handleMutation = handleUpdateInvitation;
    }
    return (React.createElement(react_apollo_1.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement("div", null,
            React.createElement(Loader_1.default, { isVisible: loading }),
            React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm })));
    }));
};
exports.default = CreateNewInvitation;
//# sourceMappingURL=index.js.map