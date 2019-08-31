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
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
var Modal_1 = require("@src/components/Modal");
var course_listing_graphql_1 = require("@src/queries/course-listing.graphql");
var course_details_graphql_1 = require("@src/queries/course-details.graphql");
var delete_course_graphql_1 = require("@src/queries/delete-course.graphql");
var DeletePrompt_1 = require("@src/components/DeletePrompt");
var CreateNew_1 = require("@src/views/Courses/CreateNew");
var Loader_1 = require("@src/components/Loader");
var ApolloError_1 = require("@src/components/ApolloError");
require("./style.scss");
var Listing_1 = require("@src/views/Modules/Listing");
var BreadCrumbs_1 = require("@src/components/BreadCrumbs");
var deleteCourseMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var courses = cache.readQuery({ query: course_listing_graphql_1.default }).courses;
            cache.writeQuery({
                query: course_listing_graphql_1.default,
                data: { courses: courses.filter(function (c) { return String(c.id) !== String(variables.id); }) }
            });
        }
    });
};
var CourseDetails = /** @class */ (function (_super) {
    __extends(CourseDetails, _super);
    function CourseDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isEditingCourse: false, isDeleting: false };
        _this.showDeletePrompt = function () { return _this.setState({ isDeleting: true }); };
        _this.hideDeletePrompt = function () { return _this.setState({ isDeleting: false }); };
        _this.showEditCourseForm = function () { return _this.setState({ isEditingCourse: true }); };
        _this.hideEditCourseForm = function () { return _this.setState({ isEditingCourse: false }); };
        return _this;
    }
    CourseDetails.prototype.render = function () {
        var _this = this;
        var c = this.props.course;
        if (!this.props.course) {
            return React.createElement("h1", null, "Course Not Found");
        }
        return (React.createElement("div", { styleName: "content" },
            React.createElement(DeletePrompt_1.default, { title: "Do you really want to delete this Course?", subtitle: "This will delete the course, all its modules and topics and everything therein.", mutation: delete_course_graphql_1.default, isVisible: this.state.isDeleting, variables: { id: this.props.course.id }, onDelete: function () { return _this.props.history.push('/courses'); }, onCancel: this.hideDeletePrompt, handleMutation: deleteCourseMutation }),
            React.createElement(Modal_1.default, { isVisible: this.state.isEditingCourse, onClose: this.hideEditCourseForm },
                React.createElement(CreateNew_1.default, { course: this.props.course })),
            React.createElement("h1", { styleName: "header" },
                c.name,
                React.createElement("div", { styleName: "controls" },
                    React.createElement("i", { styleName: "edit", title: "Edit", onClick: this.showEditCourseForm }),
                    React.createElement("i", { styleName: "delete", title: "Delete", onClick: this.showDeletePrompt }))),
            React.createElement("div", null, c.description),
            React.createElement(Listing_1.default, __assign({}, this.props))));
    };
    return CourseDetails;
}(react_1.Component));
var Course = function (props) { return (React.createElement(react_apollo_1.Query, { query: course_details_graphql_1.default, variables: { id: props.match.params.courseId } }, function (_a) {
    var loading = _a.loading, error = _a.error, data = _a.data;
    var crumbs = { Courses: '/courses' };
    if (data && data.course) {
        crumbs[data.course.name] = null;
    }
    return (React.createElement("div", { styleName: "container" },
        React.createElement(BreadCrumbs_1.default, { crumbs: crumbs }),
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(CourseDetails, __assign({ course: data.course }, props))));
})); };
exports.default = Course;
//# sourceMappingURL=index.js.map