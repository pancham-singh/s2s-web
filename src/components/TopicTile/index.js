"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var TopicTile = function (props) {
    var c = props.topic;
    return (React.createElement("div", { styleName: "container", style: {
            backgroundImage: "linear-gradient(rgba(34, 34, 34, 0.4), rgba(37, 33, 26, 0.4)), url(" + c.coverImage + ")"
        } },
        React.createElement("div", { styleName: "title" }, c.name)));
};
exports.default = TopicTile;
//# sourceMappingURL=index.js.map