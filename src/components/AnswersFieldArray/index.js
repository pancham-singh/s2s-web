"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var AddNewItemRow_1 = require("@src/components/AddNewItemRow");
var Input_1 = require("@src/components/Form/Input");
var AttachmentsFieldArray_1 = require("@src/components/AttachmentsFieldArray");
var formik_1 = require("formik");
require("./style.scss");
var AnswersField = function (_a) {
    var errors = _a.errors, values = _a.values, name = _a.name, fieldArrayOps = _a.fieldArrayOps;
    var emptyAnswer = { body: '', isCorrect: false, attachments: [] };
    var emptyAttachment = { type: 'image', url: '' };
    return (React.createElement("div", null,
        values &&
            values.length > 0 &&
            values.map(function (a, index) { return (React.createElement("div", { key: index, styleName: "answer-section" },
                React.createElement("i", { styleName: "remove-answer", onClick: function () { return fieldArrayOps.remove(index); } }),
                React.createElement(formik_1.Field, { component: Input_1.default, label: "Answer Body", placeholder: "Body of the Answer", name: name + "[" + index + "].body" }),
                React.createElement(formik_1.Field, { component: Input_1.default, type: "checkbox", label: 'Is Correct?', name: name + "[" + index + "].isCorrect", value: a.isCorrect, classNames: { wrapper: 'checkbox-form-group' } }),
                React.createElement(formik_1.FieldArray, { name: name + "[" + index + "].attachments", render: function (ops) { return (React.createElement(AttachmentsFieldArray_1.default, { values: a.attachments, name: name + "[" + index + "].attachments", fieldArrayOps: ops })); } }))); }),
        React.createElement(AddNewItemRow_1.default, { title: "Add new Answer", onClick: function () { return fieldArrayOps.push(emptyAnswer); } })));
};
exports.default = AnswersField;
//# sourceMappingURL=index.js.map