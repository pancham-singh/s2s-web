"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.scss");
var config_1 = require("@src/config");
var AnswerListing = function (props) { return (React.createElement("ul", { styleName: "listing" }, props.answers.map(function (a) { return (React.createElement("li", { key: a.id, styleName: "answer-list-item" },
    React.createElement("input", { styleName: "is-correct-input", type: "checkbox", defaultChecked: a.isCorrect, disabled: true }),
    a.attachments[0] && React.createElement("img", { src: config_1.imagePath(a.attachments[0].url), styleName: "imageThumb" }),
    React.createElement("span", { styleName: "body" }, a.body))); }))); };
exports.default = AnswerListing;
//# sourceMappingURL=index.js.map