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
Object.defineProperty(exports, "__esModule", { value: true });
var ApolloError_1 = require("@src/components/ApolloError");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
var Loader_1 = require("@src/components/Loader");
var Modal_1 = require("@src/components/Modal");
var batches_listing_graphql_1 = require("@src/queries/batches-listing.graphql");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var delete_batch_graphql_1 = require("@src/queries/delete-batch.graphql");
var CreateNew_1 = require("@src/views/Batches/CreateNew");
var react_1 = require("react");
var React = require("react");
var react_apollo_1 = require("react-apollo");
require("./style.scss");
var hasRole_1 = require("@src/lib/hasRole");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var batches = cache.readQuery({ query: batches_listing_graphql_1.default, variables: variables }).batches;
            cache.writeQuery({
                query: batches_listing_graphql_1.default,
                variables: variables,
                data: {
                    batches: batches.filter(function (c) { return String(c.id) !== String(variables.id); })
                }
            });
        }
    });
};
var BatchListing = /** @class */ (function (_super) {
    __extends(BatchListing, _super);
    function BatchListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAdding: false, isDeleting: false, selectedBatch: undefined };
        _this.showAddForm = function (batch) { return _this.setState({ isAdding: true, selectedBatch: batch }); };
        _this.hideAddForm = function () { return _this.setState({ isAdding: false, selectedTc: undefined }); };
        _this.showDeletePrompt = function (batch) {
            return _this.setState({ isDeleting: true, selectedBatch: batch });
        };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false, selectedBatch: undefined }); };
        return _this;
    }
    BatchListing.prototype.render = function () {
        var _this = this;
        var props = this.props;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Batches"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAdding, onClose: this.hideAddForm },
                React.createElement(CreateNew_1.default, { batch: this.state.selectedBatch })),
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this batch?", subtitle: "This will delete the batch.", mutation: delete_batch_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.state.selectedBatch && this.state.selectedBatch.id }, onDelete: this.hideDeletePrompt, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement("div", { styleName: "listing" },
                React.createElement(react_apollo_1.Query, { query: current_user_graphql_1.default }, function (_a) {
                    var currentUser = _a.data.currentUser;
                    return hasRole_1.default(currentUser)('admin', 'pia', 'centerIncharge') && (React.createElement("div", { styleName: "add-btn", onClick: function () { return _this.showAddForm(); } }, "Create Batch"));
                }),
                !this.props.batches.length && React.createElement("div", { styleName: "no-items-msg" }, "No batches yet"),
                !!this.props.batches.length && (React.createElement("table", { styleName: "table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "ID"),
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Course"),
                            React.createElement("th", null, "Starts on"),
                            React.createElement("th", null, "Ends on"),
                            React.createElement("th", null, "Center"),
                            React.createElement("th", null, "Actions"))),
                    React.createElement("tbody", null, props.batches.map(function (b) { return (React.createElement("tr", { key: b.id },
                        React.createElement("td", null, b.id),
                        React.createElement("td", null, b.name),
                        React.createElement("td", null, b.course.name),
                        React.createElement("td", null, new Date(b.startDate).toDateString()),
                        React.createElement("td", null, new Date(b.endDate).toDateString()),
                        React.createElement("td", null, b.trainingCenter.name),
                        React.createElement("td", { styleName: "actions-col" },
                            React.createElement("i", { styleName: "edit", title: "Edit", onClick: function () { return _this.showAddForm(b); } }),
                            React.createElement("i", { styleName: "delete", title: "Delete", onClick: function () { return _this.showDeletePrompt(b); } })))); })))))));
    };
    return BatchListing;
}(react_1.Component));
var BatchesListingWithData = function (props) { return (React.createElement(react_apollo_1.Query, { query: batches_listing_graphql_1.default }, function (_a) {
    var data = _a.data, loading = _a.loading, error = _a.error;
    return (React.createElement("div", { styleName: "content" },
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(BatchListing, { batches: data.batches })));
})); };
exports.default = BatchesListingWithData;
//# sourceMappingURL=index.js.map