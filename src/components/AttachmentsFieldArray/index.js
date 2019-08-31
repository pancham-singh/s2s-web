"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var formik_1 = require("formik");
require("./style.scss");
var ImageUpload_1 = require("@src/components/Form/ImageUpload");
var AttachmentsField = function (_a) {
    var errors = _a.errors, values = _a.values, name = _a.name, fieldArrayOps = _a.fieldArrayOps;
    var emptyAttachment = { type: 'image', url: '' };
    return (React.createElement("div", null,
        React.createElement("div", { styleName: "attachments" }, values &&
            values.length > 0 &&
            values.map(function (a, index) { return (React.createElement("div", { key: index, styleName: "attachment-row" },
                React.createElement("input", { type: "hidden", name: name + "." + index + ".type" }),
                React.createElement(formik_1.Field, { component: ImageUpload_1.default, placeholder: "Attachment Image url", name: name + "[" + index + "].url" }),
                React.createElement("i", { styleName: "remove-attachment", onClick: function () { return fieldArrayOps.remove(index); } }))); })),
        React.createElement("button", { onClick: function () { return fieldArrayOps.push(emptyAttachment); }, type: "button", styleName: "add-new-btn" }, "Add new attachment")));
};
exports.default = AttachmentsField;
//# sourceMappingURL=index.js.map