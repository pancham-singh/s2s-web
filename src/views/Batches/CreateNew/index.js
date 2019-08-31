"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApolloError_1 = require("@src/components/ApolloError");
var fecha_1 = require("fecha");
var Input_1 = require("@src/components/Form/Input");
var SelectFromQuery_1 = require("@src/components/Form/SelectFromQuery");
var Loader_1 = require("@src/components/Loader");
var batches_listing_graphql_1 = require("@src/queries/batches-listing.graphql");
var training_center_listing_graphql_1 = require("@src/queries/training-center-listing.graphql");
var course_listing_graphql_1 = require("@src/queries/course-listing.graphql");
var create_batch_graphql_1 = require("@src/queries/create-batch.graphql");
var update_batch_graphql_1 = require("@src/queries/update-batch.graphql");
var formik_1 = require("formik");
var React = require("react");
var react_apollo_1 = require("react-apollo");
var react_toastify_1 = require("react-toastify");
var yup = require("yup");
require("./style.scss");
var handleCreateBatch = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var batch = _a.data.createBatch;
            var batches = cache.readQuery({ query: batches_listing_graphql_1.default }).batches;
            cache.writeQuery({
                query: batches_listing_graphql_1.default,
                data: { batches: batches.concat(batch) }
            });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new Batch', { type: 'success' });
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var handleUpdateBatch = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    setSubmitting(true);
    mutation({
        variables: values
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Successfully updated batch!', { type: 'success' });
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
    startDate: yup
        .date()
        .required('Start Date is required')
        .max(yup.ref('endDate'), 'Start date cannot be after End date'),
    endDate: yup
        .date()
        .required('End Date is required')
        .min(yup.ref('startDate'), 'End date cannot be less than Start date'),
    courseId: yup.string().required('Please select the course of the batch'),
    trainingCenterId: yup.string().required('Please select a Training Center')
});
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement("h1", null, "Batch"),
    React.createElement(formik_1.Field, { name: "name", label: "Name of the Batch", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "startDate", type: "date", label: "Start Date", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "endDate", type: "date", label: "End Date", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "trainingCenterId", label: "Training Center", component: SelectFromQuery_1.default, query: training_center_listing_graphql_1.default, displayOption: function (d) { return d.name + " " + (d.address && '(' + d.address + ')'); }, dataNodeName: "trainingCenters" }),
    React.createElement(formik_1.Field, { name: "courseId", label: "Course", component: SelectFromQuery_1.default, dataNodeName: "courses", query: course_listing_graphql_1.default, displayOption: function (d) { return "" + d.name; } }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewBatch = function (props) {
    var initialValues = {
        id: undefined,
        name: '',
        startDate: fecha_1.format(new Date(), 'YYYY-MM-DD'),
        endDate: fecha_1.format(new Date(), 'YYYY-MM-DD'),
        trainingCenterId: '',
        courseId: ''
    };
    var mutation = create_batch_graphql_1.default;
    var handleMutation = handleCreateBatch;
    if (props.batch) {
        initialValues = {
            id: props.batch.id,
            name: props.batch.name,
            startDate: fecha_1.format(new Date(props.batch.startDate), 'YYYY-MM-DD'),
            endDate: fecha_1.format(new Date(props.batch.endDate), 'YYYY-MM-DD'),
            courseId: props.batch.course.id,
            trainingCenterId: props.batch.trainingCenter.id
        };
        mutation = update_batch_graphql_1.default;
        handleMutation = handleUpdateBatch;
    }
    return (React.createElement(react_apollo_1.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement("div", null,
            React.createElement(Loader_1.default, { isVisible: loading }),
            React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm })));
    }));
};
exports.default = CreateNewBatch;
//# sourceMappingURL=index.js.map