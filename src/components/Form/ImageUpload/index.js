"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
require("./style.scss");
var react_1 = require("react");
var Modal_1 = require("@src/components/Modal");
var Loader_1 = require("@src/components/Loader");
var react_dropzone_1 = require("react-dropzone");
var auth_1 = require("@src/auth");
var config_1 = require("@src/config");
var isAbsoluteUrl_1 = require("@src/lib/isAbsoluteUrl");
var UploadPrompt = /** @class */ (function (_super) {
    __extends(UploadPrompt, _super);
    function UploadPrompt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isUploading: false, error: '' };
        _this.uploadImage = function (files) {
            _this.setState({ isUploading: true, error: '' });
            var token = auth_1.getToken();
            var file = files[0];
            var formData = new FormData();
            formData.append('file', file);
            var requestOptions = {
                method: 'POST',
                headers: {
                    Accept: 'application/Jason',
                    'Conent-Type': 'multipart/form-data',
                    Authorization: "Bearer " + token
                },
                body: formData
            };
            fetch(config_1.apiUrls.uploadImage, requestOptions)
                .then(function (res) {
                if (res.status !== 200) {
                    throw res;
                }
                return res.json();
            })
                .then(function (res) {
                var imagePath = res.filename;
                _this.setState({ isUploading: false, error: '' });
                _this.props.onDoneUpload(imagePath);
            })
                .catch(function (err) {
                console.warn('Error occurred while uploading image', err);
                _this.setState({ isUploading: false, error: err.message || 'Failed to upload image.' });
            });
        };
        _this.handleRejection = function () {
            _this.setState({
                isUploading: false,
                error: 'Invalid file format. Please try with a valid image.'
            });
        };
        return _this;
    }
    UploadPrompt.prototype.render = function () {
        var _this = this;
        var image = this.props.image;
        return (React.createElement("div", { styleName: "prompt-container" },
            React.createElement(Loader_1.default, { isVisible: this.state.isUploading }),
            React.createElement(react_dropzone_1.default, { style: { position: 'relative' }, accept: "image/*", multiple: false, onDropAccepted: this.uploadImage, onDropRejected: this.handleRejection, onFileDialogCancel: function () { return _this.props.onDoneUpload(''); } },
                React.createElement("div", { styleName: "prompt-content" + (this.state.error ? '-with-error' : '') },
                    React.createElement("div", { styleName: "upload-message", style: {
                            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(" + image + ")"
                        } },
                        React.createElement("i", { styleName: "upload-icon" }),
                        React.createElement("span", { styleName: "message-text" }, "Drag and drop the image here")),
                    this.state.error && React.createElement("div", { styleName: "error" }, this.state.error))),
            React.createElement("button", { type: "button", styleName: "done-button" + (image ? '-success' : ''), onClick: this.props.onCancel }, "Done")));
    };
    return UploadPrompt;
}(react_1.Component));
var UploadImageField = /** @class */ (function (_super) {
    __extends(UploadImageField, _super);
    function UploadImageField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isPromptOpen: false };
        _this.showPrompt = function () { return _this.setState({ isPromptOpen: true }); };
        _this.hidePrompt = function () { return _this.setState({ isPromptOpen: false }); };
        _this.handleNewImage = function (file) {
            _this.props.form.setFieldValue(_this.props.field.name, file);
        };
        return _this;
    }
    UploadImageField.prototype.render = function () {
        var _a = this.props, field = _a.field, form = _a.form, placeholder = _a.placeholder, label = _a.label, cns = _a.classNames;
        var getFieldValue = get(field.name);
        var touched = getFieldValue(form.touched);
        var error = getFieldValue(form.errors);
        var showError = touched && error;
        var image = isAbsoluteUrl_1.default(field.value) ? field.value : config_1.apiUrls.uploadedImage(field.value);
        var classNames = __assign({ wrapper: 'input-group', wrapperHasError: 'has-error', field: 'form-control', error: 'error', label: 'label' }, (cns || {}));
        return (React.createElement("div", { title: label, className: classnames(classNames.wrapper, (_b = {},
                _b[classNames.wrapperHasError] = showError,
                _b)) },
            React.createElement(Modal_1.default, { isVisible: this.state.isPromptOpen, onClose: this.hidePrompt },
                React.createElement(UploadPrompt, { image: image, onDoneUpload: this.handleNewImage, onCancel: this.hidePrompt })),
            label && React.createElement("label", { className: classNames.label }, label),
            React.createElement("input", __assign({ title: label, type: "hidden", className: classNames.field, placeholder: placeholder || '' }, field)),
            React.createElement("div", { styleName: "upload-image-tile" + (showError ? '-with-error' : ''), style: { backgroundImage: "url(" + image + ")" }, onClick: this.showPrompt },
                image && React.createElement("i", { styleName: "change-icon" }),
                !image && React.createElement("i", { styleName: "add-icon" })),
            showError && React.createElement("div", { className: classNames.error }, error)));
        var _b;
    };
    return UploadImageField;
}(react_1.Component));
exports.default = UploadImageField;
//# sourceMappingURL=index.js.map