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
var invitation_listing_graphql_1 = require("@src/queries/invitation-listing.graphql");
var delete_invitation_graphql_1 = require("@src/queries/delete-invitation.graphql");
var CreateNew_1 = require("@src/views/Invitations/CreateNew");
var displayInvitedAs_1 = require("@src/lib/displayInvitedAs");
var react_1 = require("react");
var React = require("react");
var react_apollo_1 = require("react-apollo");
require("./style.scss");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var invitations = cache.readQuery({ query: invitation_listing_graphql_1.default, variables: variables }).invitations;
            cache.writeQuery({
                query: invitation_listing_graphql_1.default,
                variables: variables,
                data: {
                    invitations: invitations.filter(function (c) { return String(c.id) !== String(variables.id); })
                }
            });
        }
    });
};
var InvitationListing = /** @class */ (function (_super) {
    __extends(InvitationListing, _super);
    function InvitationListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAdding: false, isDeleting: false, selectedInvitation: undefined };
        _this.showAddForm = function (invitation) {
            return _this.setState({ isAdding: true, selectedInvitation: invitation });
        };
        _this.hideAddForm = function () { return _this.setState({ isAdding: false, selectedTc: undefined }); };
        _this.showDeletePrompt = function (invitation) {
            return _this.setState({ isDeleting: true, selectedInvitation: invitation });
        };
        _this.hideDeletePrompt = function () {
            return _this.setState({ isDeleting: false, selectedInvitation: undefined });
        };
        return _this;
    }
    InvitationListing.prototype.render = function () {
        var _this = this;
        var props = this.props;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Invitations"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAdding, onClose: this.hideAddForm },
                React.createElement(CreateNew_1.default, { invitation: this.state.selectedInvitation })),
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this invitation?", subtitle: "This will delete the invitation.", mutation: delete_invitation_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.state.selectedInvitation && this.state.selectedInvitation.id }, onDelete: this.hideDeletePrompt, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement("div", { styleName: "listing" },
                React.createElement("div", { styleName: "add-btn", onClick: function () { return _this.showAddForm(); } }, "Create Invitation"),
                !this.props.invitations.length && (React.createElement("div", { styleName: "no-items-msg" }, "No invitationes yet")),
                !!this.props.invitations.length && (React.createElement("table", { styleName: "table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Invited Email"),
                            React.createElement("th", null, "Invited As"),
                            React.createElement("th", null, "Invited By"),
                            React.createElement("th", null, "Valid Till"),
                            React.createElement("th", null, "Batch"),
                            React.createElement("th", null, "Training Center"),
                            React.createElement("th", null, "Actions"))),
                    React.createElement("tbody", null, props.invitations.map(function (i) { return (React.createElement("tr", { key: i.id },
                        React.createElement("td", null, i.invitedEmail),
                        React.createElement("td", null, displayInvitedAs_1.default(i.invitedAs)),
                        React.createElement("td", null, i.invitedBy.name),
                        React.createElement("td", null, i.validTill ? new Date(i.validTill).toDateString() : 'Indefinite'),
                        React.createElement("td", null, i.batch && i.batch.name),
                        React.createElement("td", null, i.trainingCenter.name),
                        React.createElement("td", { styleName: "actions-col" },
                            React.createElement("i", { styleName: "delete", title: "Delete", onClick: function () { return _this.showDeletePrompt(i); } })))); })))))));
    };
    return InvitationListing;
}(react_1.Component));
var InvitationsListingWithData = function (props) { return (React.createElement(react_apollo_1.Query, { query: invitation_listing_graphql_1.default }, function (_a) {
    var data = _a.data, loading = _a.loading, error = _a.error;
    return (React.createElement("div", { styleName: "content" },
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(InvitationListing, { invitations: data.invitations })));
})); };
exports.default = InvitationsListingWithData;
//# sourceMappingURL=index.js.map