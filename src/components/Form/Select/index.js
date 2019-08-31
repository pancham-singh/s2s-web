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
var SelectField = function (_a) {
    var field = _a.field, form = _a.form, label = _a.label, options = _a.options, classNames = _a.classNames;
    var touched = form.touched[field.name];
    var error = form.errors[field.name];
    var showError = touched && error;
    classNames = __assign({ wrapper: 'input-group', wrapperHasError: 'has-error', field: 'form-control', error: 'error', label: 'label' }, (classNames || {}));
    return (React.createElement("div", { className: classnames(classNames.wrapper, (_b = {},
            _b[classNames.wrapperHasError] = showError,
            _b)) },
        label && React.createElement("label", { className: classNames.label }, label),
        React.createElement("select", __assign({}, field, { className: classNames.field }), options.map(function (_a) {
            var title = _a.title, value = _a.value;
            return (React.createElement("option", { key: value, value: value }, title));
        })),
        showError && React.createElement("div", { className: classNames.error }, error)));
    var _b;
};
exports.default = SelectField;
//# sourceMappingURL=index.js.map