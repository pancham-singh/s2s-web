"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var AddNewItemTile = function (props) {
    var handleClick = props.onClick || (function () { return ({}); });
    return (React.createElement("div", { styleName: "container", onClick: handleClick },
        React.createElement("i", { styleName: "plus-icon" }),
        React.createElement("div", { styleName: "title" }, props.title)));
};
exports.default = AddNewItemTile;
//# sourceMappingURL=index.js.map