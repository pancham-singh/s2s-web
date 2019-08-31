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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_apollo_1 = require("react-apollo");
var Modal_1 = require("@src/components/Modal");
var AddNewItemTile_1 = require("@src/components/AddNewItemTile");
var CourseTile_1 = require("@src/components/CourseTile");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var CreateNew_1 = require("@src/views/Modules/CreateNew");
var module_listing_graphql_1 = require("@src/queries/module-listing.graphql");
require("./style.scss");
var routePrefix = function (courseId) { return "/courses/" + courseId; };
var ModuleListing_ = /** @class */ (function (_super) {
    __extends(ModuleListing_, _super);
    function ModuleListing_() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAddingNewModule: false };
        _this.startAddingModule = function () { return _this.setState({ isAddingNewModule: true }); };
        _this.stopAddingModule = function () { return _this.setState({ isAddingNewModule: false }); };
        return _this;
    }
    ModuleListing_.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Modules"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAddingNewModule, onClose: this.stopAddingModule },
                React.createElement(CreateNew_1.default, { match: this.props.match })),
            React.createElement("div", { styleName: "tiles" },
                React.createElement(AddNewItemTile_1.default, { title: "Add New Module", onClick: this.startAddingModule }),
                this.props.modules.map(function (m) { return (React.createElement(react_router_dom_1.Link, { styleName: "tile", key: m.id, to: routePrefix(_this.props.courseId) + "/modules/" + m.id },
                    React.createElement(CourseTile_1.default, { course: m }))); }))));
    };
    return ModuleListing_;
}(react_1.Component));
var ModuleListing = function (props) { return (React.createElement(react_apollo_1.Query, { query: module_listing_graphql_1.default, variables: { courseId: props.match.params.courseId } }, function (_a) {
    var data = _a.data, error = _a.error, loading = _a.loading;
    if (loading) {
        return React.createElement(Loader_1.default, { isVisible: loading });
    }
    if (error) {
        return React.createElement(ApolloError_1.default, { error: error });
    }
    return (React.createElement(ModuleListing_, { courseId: props.match.params.courseId, match: props.match, modules: data.modules }));
})); };
exports.default = ModuleListing;
//# sourceMappingURL=index.js.map