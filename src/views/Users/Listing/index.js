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
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var Modal_1 = require("@src/components/Modal");
var CreateNew_1 = require("@src/views/Users/CreateNew");
var user_listing_graphql_1 = require("@src/queries/user-listing.graphql");
require("./style.scss");
var UserListing_ = /** @class */ (function (_super) {
    __extends(UserListing_, _super);
    function UserListing_() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAddingUser: false };
        _this.showAddUserForm = function () { return _this.setState({ isAddingUser: true }); };
        _this.hideAddUserForm = function () { return _this.setState({ isAddingUser: false }); };
        return _this;
    }
    UserListing_.prototype.render = function () {
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Users"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAddingUser, onClose: this.hideAddUserForm },
                React.createElement(CreateNew_1.default, null)),
            React.createElement("div", { styleName: "user-listing" },
                React.createElement("div", { styleName: "add-new-user-btn", onClick: this.showAddUserForm }, "Add New User"),
                React.createElement("table", { styleName: "users-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Email"),
                            React.createElement("th", null, "Role"))),
                    React.createElement("tbody", null, this.props.users.map(function (u) { return (React.createElement("tr", { key: u.id },
                        React.createElement("td", null, u.name),
                        React.createElement("td", null, u.email),
                        React.createElement("td", null, u.roles.length && u.roles[0].name))); }))))));
    };
    return UserListing_;
}(react_1.Component));
var UserListing = function () { return (React.createElement(react_apollo_1.Query, { query: user_listing_graphql_1.default }, function (_a) {
    var data = _a.data, error = _a.error, loading = _a.loading;
    return (React.createElement("div", { styleName: "content" },
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(UserListing_, { users: data.users })));
})); };
exports.default = UserListing;
//# sourceMappingURL=index.js.map