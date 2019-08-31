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
var ApolloError_1 = require("@src/components/ApolloError");
var Input_1 = require("@src/components/Form/Input");
var SelectFromQuery_1 = require("@src/components/Form/SelectFromQuery");
var Loader_1 = require("@src/components/Loader");
var batches_listing_graphql_1 = require("@src/queries/batches-listing.graphql");
var course_listing_graphql_1 = require("@src/queries/course-listing.graphql");
var create_assessment_graphql_1 = require("@src/queries/create-assessment.graphql");
var topic_listing_graphql_1 = require("@src/queries/topic-listing.graphql");
var formik_1 = require("formik");
var React = require("react");
var react_1 = require("react");
var react_apollo_1 = require("react-apollo");
var react_apollo_2 = require("react-apollo");
var react_toastify_1 = require("react-toastify");
var yup = require("yup");
require("./style.scss");
var CourseList = function (props) { return (React.createElement("div", { styleName: "course-container" },
    React.createElement("div", { styleName: "list-content" },
        React.createElement("h2", null, "Domain Courses"),
        props.courses.map(function (c) { return (React.createElement("div", { key: c.id }, c.category === 'domain' && React.createElement("label", null,
            React.createElement("input", { name: "domain", type: "radio", onChange: function (e) { props.onCourseSelect(props.courses.indexOf(c), e); } }),
            React.createElement("span", null,
                " ",
                c.name)))); })),
    React.createElement("div", { styleName: "list-content" },
        React.createElement("h2", null, "Non-Domain Courses"),
        props.courses.map(function (c) { return (React.createElement("div", { key: c.id }, c.category === 'non-domain' && React.createElement("label", null,
            React.createElement("input", { name: "non-domain", type: "checkbox", onChange: function (e) { props.onCourseSelect(props.courses.indexOf(c), e); } }),
            React.createElement("span", null,
                " ",
                c.name)))); })))); };
var ModuleList = function (props) { return (React.createElement("div", { styleName: "course-container" },
    React.createElement("div", { styleName: "list-content" },
        React.createElement("h2", null, "Domain Modules"),
        props.modules.map(function (m) { return (React.createElement("div", { key: m.id }, m.category === 'domain' && React.createElement("label", null,
            React.createElement("input", { name: "domain", type: "radio", onChange: function (e) { props.onModuleSelect(m.id); } }),
            React.createElement("span", null,
                " ",
                m.name)))); })),
    React.createElement("div", { styleName: "list-content" },
        React.createElement("h2", null, "Non-Domain Modules"),
        props.modules.map(function (m) { return (React.createElement("div", { key: m.id }, m.category === 'non-domain' && React.createElement("label", null,
            React.createElement("input", { name: "non-domain", type: "radio", onChange: function (e) { props.onModuleSelect(m.id); } }),
            React.createElement("span", null,
                " ",
                m.name)))); })))); };
var TopicList = function (props) { return (React.createElement("div", { styleName: "content" },
    React.createElement("h2", null, "Topics"),
    console.log('topic props ', props),
    props.topics.map(function (t) { return (React.createElement("div", { key: t.id },
        React.createElement("label", null,
            React.createElement("input", { name: "non-domain", type: "radio", onChange: function (e) { props.onTopicSelect(props.topics.indexOf(t), e); } }),
            React.createElement("span", null,
                " ",
                t.name)))); }))); };
var SelectedTopicList = function (props) { return (React.createElement("div", { styleName: "content" },
    React.createElement("h2", null, "Selected Topics"),
    props.topics.map(function (t) { return (React.createElement("div", { key: t.id }, t.selected &&
        React.createElement("div", { styleName: "selected-topics-list" },
            React.createElement("div", { styleName: "topic-name" },
                React.createElement("h3", { styleName: "select-topic" },
                    " ",
                    t.name)),
            React.createElement("div", { styleName: "delete-btn" },
                React.createElement("i", { styleName: "delete", title: "Delete", onClick: function () { props.onTopicDelete(props.topics.indexOf(t)); } }))))); }))); };
var topicsSchema = yup
    .array()
    .of(yup.object().shape({
    topic: yup
        .string()
        .required(),
    theoryCount: yup.number().required('Required'),
    practicalCount: yup.number().required('Required')
}))
    .nullable(true);
var validationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required'),
    startDate: yup.date().min(new Date(), 'Can not create already expired invitation'),
    endDate: yup.date().min(new Date(), 'Can not create already expired invitation'),
    durationMinutes: yup.string(),
    topics: topicsSchema,
    batch: yup.string()
});
var handleCreateAssessment = function (mutation) { return function (values, _a) {
    var setStatus = _a.setStatus, setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
    console.log('data to save', values);
    setSubmitting(true);
    mutation({
        variables: values,
        update: function (cache, _a) {
            var assessment = _a.data.createAssessment;
            // const { assessments } = cache.readQuery({ query: ASSESSMENT_LISTING });
            // cache.writeQuery({
            //     query: ASSESSMENT_LISTING,
            //     data: { assessments: assessments.concat(assessment) }
            // });
        }
    })
        .then(function (res) {
        setSubmitting(false);
        resetForm();
        react_toastify_1.toast('Created new Assessment', { type: 'success' });
        location.href = "/assessments";
    })
        .catch(function (err) {
        setSubmitting(false);
        setStatus(err);
    });
}; };
var InnerForm = function (formData) { return (React.createElement(formik_1.Form, { styleName: "form-container" },
    React.createElement(formik_1.Field, { name: "batch", label: "Batches", component: SelectFromQuery_1.default, dataNodeName: "batches", query: batches_listing_graphql_1.default, displayOption: function (d) { return "" + d.name; } }),
    React.createElement(formik_1.Field, { name: "name", type: "text", label: "Assessment Name", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "startDate", type: "date", label: "Start Date", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "endDate", type: "date", label: "End Date", component: Input_1.default }),
    React.createElement(formik_1.Field, { name: "durationMinutes", type: "text", label: "Duration In Minutes", component: Input_1.default }),
    formData.status && React.createElement(ApolloError_1.default, { error: formData.status }),
    React.createElement("button", { className: "btn-primary" }, "Save"))); };
var CreateNewAssessment = function (props) {
    var initialValues = {
        id: undefined,
        name: '',
        topics: props.topics || [],
        batch: '',
        durationMinutes: 0,
        startDate: '',
        endDate: ''
    };
    var mutation = create_assessment_graphql_1.default;
    var handleMutation = handleCreateAssessment;
    return (React.createElement(react_apollo_1.Mutation, { mutation: mutation }, function (mutationFunc, _a) {
        var loading = _a.loading, error = _a.error;
        return (React.createElement("div", null,
            React.createElement(Loader_1.default, { isVisible: loading }),
            React.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleMutation(mutationFunc), render: InnerForm })));
    }));
};
var CreateAssessment = /** @class */ (function (_super) {
    __extends(CreateAssessment, _super);
    function CreateAssessment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.courses = [];
        _this.modules = [];
        _this.selectedCourses = [];
        _this.topics = [];
        _this.state = { step: 1, moduleId: 0, topicIndex: -1, selectedTopics: [], topicsPayload: [] };
        _this.getCourseList = function (courses) {
            courses.map(function (c) {
                _this.courses.push({
                    id: c.id,
                    name: c.name,
                    category: c.category,
                    modules: c.modules,
                    selected: false
                });
            });
        };
        _this.onCourseSelect = function (index, value) {
            console.log("value of index " + index, value.target.checked);
            _this.courses[index].selected = value.target.checked;
        };
        _this.onModuleSelect = function (value) {
            console.log("value of ", value);
            _this.setState({ moduleId: value });
        };
        _this.onTopicSelect = function (index, value) {
            console.log("value of ", index);
            // this.topics[index].selected = value.target.checked;?
            _this.setState({ topicIndex: index });
        };
        _this.getSelectedCourses = function () {
            _this.courses.map(function (c) {
                if (c.selected) {
                    _this.selectedCourses.push(c);
                    c.modules.map(function (m) {
                        _this.modules.push({
                            id: m.id,
                            name: m.name,
                            category: c.category,
                            selected: false
                        });
                    });
                }
            });
        };
        _this.getTopicsList = function (topics) {
            _this.topics = [];
            topics.map(function (t) {
                _this.topics.push({
                    id: t.id,
                    name: t.name,
                    selected: false,
                    theoryCount: 0,
                    practicalCount: 0,
                });
            });
        };
        _this.nextStep = function (step) {
            _this.setState({ step: step });
            if (step === 2) {
                _this.getSelectedCourses();
            }
            if (step === 3) {
                var stopics_1 = [];
                _this.state.selectedTopics.map(function (st) {
                    stopics_1.push({
                        topic: st.id,
                        theoryCount: st.theoryCount,
                        practicalCount: st.practicalCount
                    });
                });
                _this.setState({ topicsPayload: stopics_1 });
            }
        };
        _this.addTopic = function (value) {
            var topics = _this.state.selectedTopics;
            if (_this.topics.length > 0) {
                _this.topics[value.topicIndex].selected = true;
                topics.push(_this.topics[value.topicIndex]);
                _this.setState({ selectedTopics: topics, topicIndex: -1 });
            }
        };
        _this.removeSelectedTopic = function (index) {
            var topics = _this.state.selectedTopics;
            topics.splice(index, 1);
            _this.setState({ selectedTopics: topics });
        };
        _this.CourseListing = function () { return (React.createElement(react_apollo_2.Query, { query: course_listing_graphql_1.default }, function (_a) {
            var data = _a.data, error = _a.error, loading = _a.loading;
            if (loading) {
                return React.createElement(Loader_1.default, { isVisible: loading });
            }
            if (error) {
                return React.createElement(ApolloError_1.default, { error: error });
            }
            _this.getCourseList(data.courses);
            return (React.createElement("div", null, !loading && !error && React.createElement(CourseList, { courses: _this.courses, onCourseSelect: _this.onCourseSelect })));
        })); };
        _this.AddTopic = function (topic) { return (React.createElement("div", { styleName: "content" },
            React.createElement("div", { styleName: "topic-form-container" },
                React.createElement("input", { type: "text", styleName: "input-style", onChange: function (e) { _this.topics[topic.topicIndex].theoryCount = e.target.value; }, placeholder: "Theory Count" }),
                React.createElement("input", { type: "text", styleName: "input-style", onChange: function (e) { _this.topics[topic.topicIndex].practicalCount = e.target.value; }, placeholder: "Practical Count" }),
                React.createElement("button", { className: "btn-primary", onClick: function () { _this.addTopic(topic); } }, "Add")))); };
        return _this;
    }
    CreateAssessment.prototype.render = function () {
        var _this = this;
        var CoursesFetch = this.CourseListing;
        var TopicForm = this.AddTopic;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("div", { styleName: "content" },
                React.createElement("h2", null, "Create Assessment"),
                this.state.step === 1 && React.createElement(CoursesFetch, null),
                this.state.step === 2 && React.createElement(ModuleList, { modules: this.modules, onModuleSelect: this.onModuleSelect }),
                React.createElement("div", { styleName: "course-container" },
                    this.state.step === 2 &&
                        React.createElement(react_apollo_2.Query, { query: topic_listing_graphql_1.default, variables: { moduleId: this.state.moduleId } }, function (_a) {
                            var data = _a.data, error = _a.error, loading = _a.loading;
                            if (loading) {
                                return React.createElement(Loader_1.default, { isVisible: loading });
                            }
                            if (error) {
                                return React.createElement(ApolloError_1.default, { error: error });
                            }
                            if (!loading && !error) {
                                _this.getTopicsList(data.topics);
                            }
                            return (React.createElement("div", { styleName: "topic-container" }, !loading && !error &&
                                React.createElement(TopicList, { topics: _this.topics, onTopicSelect: _this.onTopicSelect })));
                        }),
                    this.state.step === 2 && this.state.topicIndex >= 0 && React.createElement(TopicForm, { topicIndex: this.state.topicIndex })),
                this.state.step === 2 && this.state.selectedTopics.length > 0 && React.createElement(SelectedTopicList, { onTopicDelete: this.removeSelectedTopic, topics: this.state.selectedTopics }),
                this.state.step === 3 && React.createElement(CreateNewAssessment, { topics: this.state.topicsPayload }),
                this.state.step <= 2 && React.createElement("button", { className: "btn-primary", onClick: function () { _this.nextStep(_this.state.step + 1); } }, "Next"))));
    };
    return CreateAssessment;
}(react_1.Component));
exports.default = CreateAssessment;
//# sourceMappingURL=index.js.map