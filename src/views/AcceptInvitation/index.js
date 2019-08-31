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
var Loader_1 = require("@src/components/Loader");
var invitation_for_token_graphql_1 = require("@src/queries/invitation-for-token.graphql");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var RegisterWithInvite_1 = require("@src/views/AcceptInvitation/RegisterWithInvite");
var React = require("react");
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
require("./style.scss");
var AcceptInvitation = /** @class */ (function (_super) {
    __extends(AcceptInvitation, _super);
    function AcceptInvitation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AcceptInvitation.prototype.render = function () {
        return (React.createElement(react_apollo_1.Query, { query: invitation_for_token_graphql_1.default, variables: { token: this.props.match.params.token } }, function (_a) {
            var data = _a.data, error = _a.error, loading = _a.loading;
            return (React.createElement("div", { styleName: "container" },
                React.createElement("div", { styleName: "content" },
                    React.createElement(Loader_1.default, { isVisible: loading }),
                    error && React.createElement(ApolloError_1.default, { error: error }),
                    !error &&
                        !loading && (React.createElement(react_apollo_1.Query, { query: current_user_graphql_1.default }, function (_a) {
                        var userData = _a.data, loadingUser = _a.loading, userError = _a.error;
                        return (React.createElement("div", null,
                            React.createElement(Loader_1.default, { isVisible: loadingUser }),
                            React.createElement(RegisterWithInvite_1.default, { invitation: data.invitationForToken, user: userData.currentUser })));
                    })))));
        }));
    };
    return AcceptInvitation;
}(react_1.Component));
exports.default = AcceptInvitation;
//# sourceMappingURL=index.js.map