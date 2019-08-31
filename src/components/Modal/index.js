"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var Modal = function (props) {
    if (!props.isVisible) {
        return null;
    }
    return (React.createElement("div", { styleName: "container" },
        React.createElement("div", { styleName: "content" },
            React.createElement("i", { styleName: "close-modal-btn", onClick: props.onClose }),
            props.children)));
};
exports.default = Modal;
//# sourceMappingURL=index.js.map