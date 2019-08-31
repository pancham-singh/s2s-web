"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Loader_1 = require("@src/components/Loader");
var react_apollo_1 = require("react-apollo");
var Modal_1 = require("@src/components/Modal");
require("./style.scss");
var DeletePrompt = function (props) { return (React.createElement(react_apollo_1.Mutation, { mutation: props.mutation }, function (mutation, _a) {
    var loading = _a.loading, error = _a.error;
    return (React.createElement(Modal_1.default, { isVisible: props.isVisible, onClose: loading ? function () { return ({}); } : props.onCancel },
        React.createElement("div", { styleName: "delete-prompt" },
            React.createElement(Loader_1.default, { isVisible: loading }),
            React.createElement("div", { styleName: "delete-prompt-title" }, props.title),
            React.createElement("div", { styleName: "delete-prompt-subtitle" }, props.subtitle),
            React.createElement("div", { styleName: "delete-prompt-btns" },
                React.createElement("button", { styleName: "cancel-prompt-btn", type: "button", onClick: props.onCancel, disabled: loading }, "Cancel"),
                React.createElement("button", { styleName: "delete-prompt-delete-btn", type: "button", onClick: function () { return props.handleMutation(mutation, props.variables).then(props.onDelete); }, disabled: loading }, "Delete")))));
})); };
exports.default = DeletePrompt;
//# sourceMappingURL=index.js.map