"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames = require("classnames");
var react_apollo_1 = require("react-apollo");
var user_listing_graphql_1 = require("@src/queries/user-listing.graphql");
var SelectUserField = function (_a) {
    var allowEmpty = _a.allowEmpty, field = _a.field, form = _a.form, label = _a.label, classNames = _a.classNames, props = __rest(_a, ["allowEmpty", "field", "form", "label", "classNames"]);
    var touched = form.touched[field.name];
    var error = form.errors[field.name];
    var showError = touched && error;
    classNames = __assign({ wrapper: 'input-group', wrapperHasError: 'has-error', field: 'form-control', error: 'error', label: 'label' }, (classNames || {}));
    return (React.createElement("div", { className: classnames(classNames.wrapper, (_b = {},
            _b[classNames.wrapperHasError] = showError,
            _b)) },
        label && React.createElement("label", { className: classNames.label }, label),
        React.createElement("select", __assign({}, field, { className: classNames.field }),
            React.createElement(react_apollo_1.Query, { query: user_listing_graphql_1.default }, function (_a) {
                var data = _a.data, loading = _a.loading, error = _a.error;
                if (error) {
                    return React.createElement("option", { value: null }, "Could not load users");
                }
                if (loading) {
                    return React.createElement("option", { value: null }, "...loading users list");
                }
                if (!error && !loading) {
                    var options = [React.createElement("option", { key: 'none' }, "Unselected")];
                    options = options.concat(data.users.map(function (_a) {
                        var id = _a.id, name = _a.name, email = _a.email;
                        return (React.createElement("option", { key: id, value: id },
                            name,
                            " (",
                            email,
                            ")"));
                    }));
                    return options;
                }
            })),
        showError && React.createElement("div", { className: classNames.error }, error)));
    var _b;
};
exports.default = SelectUserField;
//# sourceMappingURL=index.js.map