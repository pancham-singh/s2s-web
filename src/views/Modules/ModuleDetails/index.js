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
var react_apollo_1 = require("react-apollo");
var module_details_graphql_1 = require("@src/queries/module-details.graphql");
var module_listing_graphql_1 = require("@src/queries/module-listing.graphql");
var delete_module_graphql_1 = require("@src/queries/delete-module.graphql");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
var Modal_1 = require("@src/components/Modal");
var CreateNew_1 = require("@src/views/Modules/CreateNew");
var Loader_1 = require("@src/components/Loader");
var BreadCrumbs_1 = require("@src/components/BreadCrumbs");
var ApolloError_1 = require("@src/components/ApolloError");
require("./style.scss");
var Listing_1 = require("@src/views/Topics/Listing");
var react_1 = require("react");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var modules = cache.readQuery({ query: module_listing_graphql_1.default, variables: variables }).modules;
            cache.writeQuery({
                query: module_listing_graphql_1.default,
                variables: variables,
                data: { modules: modules.filter(function (c) { return String(c.id) !== String(variables.id); }) }
            });
        }
    });
};
var ModuleDetails = /** @class */ (function (_super) {
    __extends(ModuleDetails, _super);
    function ModuleDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isEditing: false, isDeleting: false };
        _this.showDeletePrompt = function () { return _this.setState({ isDeleting: true }); };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false }); };
        _this.showEditForm = function () { return _this.setState({ isEditing: true }); };
        _this.hideEditForm = function () { return _this.setState({ isEditing: false }); };
        return _this;
    }
    ModuleDetails.prototype.render = function () {
        var _this = this;
        var m = this.props.module;
        var courseId = this.props.module.course.id;
        if (!this.props.module) {
            return React.createElement("h1", null, "Module Not Found");
        }
        return (React.createElement("div", { styleName: "content" },
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this Module?", subtitle: "This will delete the module, all its topics and everything therein.", mutation: delete_module_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.props.module.id, courseId: courseId }, onDelete: function () { return _this.props.history.push("/courses/" + courseId); }, onCancel: this.hideDeletePrompt, handleMutation: deleteMutation }),
            React.createElement(Modal_1.default, { isVisible: this.state.isEditing, onClose: this.hideEditForm },
                React.createElement(CreateNew_1.default, __assign({}, this.props, { module: this.props.module }))),
            React.createElement("h1", { styleName: "header" },
                m.name,
                React.createElement("div", { styleName: "controls" },
                    React.createElement("i", { styleName: "edit", title: "Edit", onClick: this.showEditForm }),
                    React.createElement("i", { styleName: "delete", title: "Delete", onClick: this.showDeletePrompt }))),
            React.createElement("div", null, m.description),
            React.createElement(Listing_1.default, __assign({}, this.props))));
    };
    return ModuleDetails;
}(react_1.Component));
var Module = function (props) { return (React.createElement(react_apollo_1.Query, { query: module_details_graphql_1.default, variables: { id: props.match.params.moduleId } }, function (_a) {
    var loading = _a.loading, error = _a.error, data = _a.data;
    var courseId = props.match.params.courseId;
    var crumbs = {
        Courses: '/courses'
    };
    if (data && data.module) {
        crumbs[data.module.course.name] = "/courses/" + courseId;
        crumbs[data.module.name] = null;
    }
    return (React.createElement("div", { styleName: "container" },
        React.createElement(BreadCrumbs_1.default, { crumbs: crumbs }),
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(ModuleDetails, __assign({ module: data.module }, props))));
})); };
exports.default = Module;
//# sourceMappingURL=index.js.map