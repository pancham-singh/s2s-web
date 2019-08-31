"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var yup = require("yup");
var react_apollo_1 = require("react-apollo");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var react_toastify_1 = require("react-toastify");
var formik_1 = require("formik");
var react_apollo_2 = require("react-apollo");
var create_training_center_graphql_1 = require("@src/queries/create-training-center.graphql");
var update_training_center_graphql_1 = require("@src/queries/update-training-center.graphql");
var training_center_listing_graphql_1 = require("@src/queries/training-center-listing.graphql");
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var SelectUser_1 = require("@src/components/Form/SelectUser");
var Loader_1 = require("@src/components/Loader");
require("./style.scss");
var hasRole_1 = require("@src/lib/hasRole");
var handleCreateTrainingCenter = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var trainingCenter = _a.data.createTrainingCenter;
            var trainingCenters = cache.readQuery({ query: training_center_listing_graphql_1.default }).trainingCenters;
            cache.writeQuery({
                query: training_center_listing_graphql_1.default,
                data: { trainingCenters: trainingCenters.concat(trainingCenter) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new Training Center', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateTrainingCenter = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated training center!', { type: 'success' });
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
    address: yup.string(),
    pia: yup.string().required('Cannot create a training center without a PIA'),
    incharge: yup.string()
});
var InnerForm = function (formData) { return (React.createElement(react_apollo_1.Query, { query: current_user_graphql_1.default }, function (_a) {
    var data = _a.data, loading = _a.loading, error = _a.error;
    if (loading) {
        return React.createElement(Loader_1.default, { isVisible: loading });
    }
    if (error) {
        return React.createElement(ApolloError_1.default, { error: error });
    }
    var user = data.currentUser;
    var isPia = hasRole_1.default(user)('pia');
    if (isPia && !formData.values.pia) {
        setImmediate(function () { return formData.setFieldValue('pia', String(user.id)); });
    }
    return (React.createElement(formik_1.Form, { styleName: "form-container" },
        React.createElement("h1", null, "Training Center"),
        React.createElement(formik_1.Field, { name: "name", label: "Name of the TrainingCenter", component: Input_1.default }),
        React.createElement(formik_1.Field, { name: "address", label: "Address", component: Input_1.default }),
        !isPia && React.createElement(formik_1.Field, { name: "pia", label: "PIA", component: SelectUser_1.default }),
        React.createElement(formik_1.Field, { name: "incharge", label: "Center Incharge", allowEmpty: true, component: SelectUser_1.default }),
        formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
        React.createElement("button", { className: "btn-primary" }, "Save")));
})); };
var CreateNewTrainingCenter = function (props) {
    var initialValues = {
        id: undefined,
        name: '',
        address: '',
        incharge: '',
        pia: ''
    };
    var mutation = create_training_center_graphql_1.default;
    var handleMutation = handleCreateTrainingCenter;
    if (props.trainingCenter) {
        var incharge = props.trainingCenter.incharges && props.trainingCenter.incharges.length
            ? props.trainingCenter.incharges[0]
            : null;
        initialValues = {
            id: props.trainingCenter.id,
            name: props.trainingCenter.name,
            address: props.trainingCenter.address,
            pia: props.trainingCenter.pia.id,
            incharge: incharge ? incharge.id : ''
        };
        mutation = update_training_center_graphql_1.default;
        handleMutation = handleUpdateTrainingCenter;
    }
    return (React.createElement(react_apollo_2.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement("div", null,
            React.createElement(Loader_1.default, { isVisible: loading }),
            React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm })));
    }));
};
exports.default = CreateNewTrainingCenter;
//# sourceMappingURL=index.js.map