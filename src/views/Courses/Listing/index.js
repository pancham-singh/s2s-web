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
var CourseTile_1 = require("@src/components/CourseTile");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
var Modal_1 = require("@src/components/Modal");
var AddNewItemTile_1 = require("@src/components/AddNewItemTile");
var CreateNew_1 = require("@src/views/Courses/CreateNew");
var course_listing_graphql_1 = require("@src/queries/course-listing.graphql");
require("./style.scss");
var CourseListing_ = /** @class */ (function (_super) {
    __extends(CourseListing_, _super);
    function CourseListing_() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAddingCourse: false };
        _this.showAddCourseForm = function () { return _this.setState({ isAddingCourse: true }); };
        _this.hideAddCourseForm = function () { return _this.setState({ isAddingCourse: false }); };
        return _this;
    }
    CourseListing_.prototype.render = function () {
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Courses"),
            React.createElement(Modal_1.default, { isVisible: this.state.isAddingCourse, onClose: this.hideAddCourseForm },
                React.createElement(CreateNew_1.default, null)),
            React.createElement("div", { styleName: "tiles" },
                React.createElement(AddNewItemTile_1.default, { title: "Add New Course", onClick: this.showAddCourseForm }),
                this.props.courses.map(function (c) { return (React.createElement(react_router_dom_1.Link, { styleName: "tile", key: c.id, to: "/courses/" + c.id },
                    React.createElement(CourseTile_1.default, { course: c }))); }))));
    };
    return CourseListing_;
}(react_1.Component));
var CourseListing = function () { return (React.createElement(react_apollo_1.Query, { query: course_listing_graphql_1.default }, function (_a) {
    var data = _a.data, error = _a.error, loading = _a.loading;
    if (loading) {
        return React.createElement(Loader_1.default, { isVisible: loading });
    }
    if (error) {
        return React.createElement(ApolloError_1.default, { error: error });
    }
    return React.createElement(CourseListing_, { courses: data.courses });
})); };
exports.default = CourseListing;
//# sourceMappingURL=index.js.map