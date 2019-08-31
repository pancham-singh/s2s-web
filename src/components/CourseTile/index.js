"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var isAbsoluteUrl_1 = require("@src/lib/isAbsoluteUrl");
var config_1 = require("@src/config");
var CourseTile = function (props) {
    var c = props.course;
    var coverImage = isAbsoluteUrl_1.default(c.coverImage)
        ? c.coverImage
        : config_1.apiUrls.uploadedImage(c.coverImage);
    return (React.createElement("div", { styleName: "container", style: {
            backgroundImage: "linear-gradient(rgba(34, 34, 34, 0.4), rgba(37, 33, 26, 0.4)), url(" + coverImage + ")"
        } },
        React.createElement("div", { styleName: "title" }, c.name)));
};
exports.default = CourseTile;
//# sourceMappingURL=index.js.map