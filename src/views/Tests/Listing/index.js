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
var Loader_1 = require("@src/components/Loader");
var assessment_listing_graphql_1 = require("@src/queries/assessment-listing.graphql");
var react_1 = require("react");
var React = require("react");
var react_apollo_1 = require("react-apollo");
require("./style.scss");
var deleteMutation = function (mutation, variables) {
    return mutation({
        variables: variables,
        update: function (cache) {
            var assessments = cache.readQuery({ query: assessment_listing_graphql_1.default, variables: variables }).assessments;
            cache.writeQuery({
                query: assessment_listing_graphql_1.default,
                variables: variables,
                data: {
                    assessments: assessments.filter(function (c) { return String(c.id) !== String(variables.id); })
                }
            });
        }
    });
};
var TestsListing = /** @class */ (function (_super) {
    __extends(TestsListing, _super);
    function TestsListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { isAdding: false, isDeleting: false, selectedAssessment: undefined };
        return _this;
    }
    TestsListing.prototype.render = function () {
        var props = this.props;
        return (React.createElement("div", { styleName: "container" },
            React.createElement("h1", null, "Tests"),
            React.createElement("div", { styleName: "listing" },
                !this.props.assessments.length && (React.createElement("div", { styleName: "no-items-msg" }, "No Assessments yet")),
                !!this.props.assessments.length && (React.createElement("table", { styleName: "table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Duration"),
                            React.createElement("th", null, "Start Date"),
                            React.createElement("th", null, "End Date"),
                            React.createElement("th", null, "Actions"))),
                    React.createElement("tbody", null, props.assessments.map(function (a) { return (React.createElement("tr", { key: a.id },
                        React.createElement("td", null, a.name),
                        React.createElement("td", null, a.durationMinutes),
                        React.createElement("td", null, a.startDate ? new Date(a.startDate).toDateString() : 'Indefinite'),
                        React.createElement("td", null, a.endDate ? new Date(a.endDate).toDateString() : 'Indefinite'),
                        React.createElement("td", { styleName: "actions-col" },
                            React.createElement("a", { href: "tests/" + a.id },
                                React.createElement("i", { styleName: "edit", title: "Start Test" }))))); })))))));
    };
    return TestsListing;
}(react_1.Component));
var TestsListingWithData = function (props) { return (React.createElement(react_apollo_1.Query, { query: assessment_listing_graphql_1.default }, function (_a) {
    var data = _a.data, loading = _a.loading, error = _a.error;
    return (React.createElement("div", { styleName: "content" },
        React.createElement(Loader_1.default, { isVisible: loading }),
        error && React.createElement(ApolloError_1.default, { error: error }),
        !loading && !error && React.createElement(TestsListing, { assessments: data.assessments })));
})); };
exports.default = TestsListingWithData;
//# sourceMappingURL=index.js.map