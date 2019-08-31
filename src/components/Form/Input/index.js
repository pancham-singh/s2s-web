"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames = require("classnames");
var get = require("lodash/fp/get");
var InputField = function (_a) {
    var field = _a.field, form = _a.form, type = _a.type, pattern = _a.pattern, placeholder = _a.placeholder, label = _a.label, classNames = _a.classNames, disabled = _a.disabled;
    var onChange = function (e) {
        var val = e.target.value;
        if (val && pattern && !pattern.test(val)) {
            return;
        }
        field.onChange(e);
    };
    var getFieldValue = get(field.name);
    var touched = getFieldValue(form.touched);
    var error = getFieldValue(form.errors);
    var showError = touched && error;
    classNames = __assign({ wrapper: 'input-group', wrapperHasError: 'has-error', field: 'form-control', error: 'error', label: 'label' }, (classNames || {}));
    return (React.createElement("div", { className: classnames(classNames.wrapper, (_b = {},
            _b[classNames.wrapperHasError] = showError,
            _b)) },
        label && React.createElement("label", { className: classNames.label }, label),
        React.createElement("input", __assign({}, field, { onChange: onChange, type: type, checked: field.value, className: classNames.field, disabled: disabled, placeholder: placeholder || '' })),
        showError && React.createElement("div", { className: classNames.error }, error)));
    var _b;
};
exports.default = InputField;
//# sourceMappingURL=index.js.map