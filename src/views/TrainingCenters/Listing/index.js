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
var React = require("react");
var training_center_listing_graphql_1 = require("@src/queries/training-center-listing.graphql");
var react_apollo_1 = require("react-apollo");
var ApolloError_1 = require("@src/components/ApolloError");
var Loader_1 = require("@src/components/Loader");
var react_1 = require("react");
var CreateNew_1 = require("@src/views/TrainingCenters/CreateNew");
var Modal_1 = require("@src/components/Modal");
var delete_training_center_graphql_1 = require("@src/queries/delete-training-center.graphql");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
require("./style.scss");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var trainingCenters = cache.readQuery({ query: training_center_listing_graphql_1.default, variables: variables }).trainingCenters;
            cache.writeQuery({
                query: training_center_listing_graphql_1.default,
                variables: variables,
                data: {
                    trainingCenters: trainingCenters.filter(function (c) { return String(c.id) !== String(variables.id); })
                }
            });
        }
    });
};
var TCListing = /** @class */ (function (_super) {
    __extends(TCListing, _super);
    function TCListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAdding: false, isDeleting: false, selectedTc: undefined };
        _this.showAddForm = function (tc) { return _this.setState({ isAdding: true, selectedTc: tc }); };
        _this.hideAddForm = function () { return _this.setState({ isAdding: false, selectedTc: undefined }); };
        _this.showDeletePrompt = function (tc) { return _this.setState({ isDeleting: true, selectedTc: tc }); };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false, selectedTc: undefined }); };
        return _this;
    }
    TCListing.prototype.render = function () {
        var _this = this;
        var props = this.props;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Training Centers"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAdding, onClose: this.hideAddForm },
                React.createElement(CreateNew_1.default, { trainingCenter: this.state.selectedTc })),
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this topic?", subtitle: "This will delete the topic, all its questions and everything therein.", mutation: delete_training_center_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.state.selectedTc && this.state.selectedTc.id }, onDelete: this.hideDeletePrompt, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement("div", { styleName: "listing" },
                React.createElement("div", { styleName: "add-btn", onClick: function () { return _this.showAddForm(); } }, "Create Training Center"),
                !this.props.centers.length && (React.createElement("div", { styleName: "no-items-msg" }, "No training centers yet")),
                !!this.props.centers.length && (React.createElement("table", { styleName: "table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "ID"),
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Address"),
                            React.createElement("th", null, "PIA"),
                            React.createElement("th", null, "In-Charge"),
                            React.createElement("th", null, "Actions"))),
                    React.createElement("tbody", null, props.centers.map(function (c) { return (React.createElement("tr", { key: c.id },
                        React.createElement("td", null, c.id),
                        React.createElement("td", null, c.name),
                        React.createElement("td", null, c.address),
                        React.createElement("td", null, c.pia && c.pia.name),
                        React.createElement("td", null, Boolean(c.incharges && c.incharges.length) && c.incharges[0].name),
                        React.createElement("td", { styleName: "actions-col" },
                            React.createElement("i", { styleName: "edit", title: "Edit", onClick: function () { return _this.showAddForm(c); } }),
                            React.createElement("i", { styleName: "delete", title: "Delete", onClick: function () { return _this.showDeletePrompt(c); } })))); })))))));
    };
    return TCListing;
}(react_1.Component));
var TCListingWithData = function (props) { return (React.createElement(react_apollo_1.Query, { query: training_center_listing_graphql_1.default }, function (_a) {
    var data = _a.data, loading = _a.loading, error = _a.error;
    return (React.createElement("div", { styleName: "content" },
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(TCListing, { centers: data.trainingCenters })));
})); };
exports.default = TCListingWithData;
//# sourceMappingURL=index.js.map