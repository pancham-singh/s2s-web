"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/* globals document */
var React = require("react");
var ReactDOM = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var react_apollo_1 = require("react-apollo");
var current_user_graphql_1 = require("@src/queries/current-user.graphql");
var apollo_boost_1 = require("apollo-boost");
var App_1 = require("./views/App");
var config_1 = require("@src/config");
var auth_1 = require("@src/auth");
var client = new apollo_boost_1.default({
    uri: config_1.apiUrls.graphql,
    fetchOptions: {
        credentials: 'include'
    },
    request: function (operation) { return __awaiter(_this, void 0, void 0, function () {
        var token, data, user;
        return __generator(this, function (_a) {
            token = auth_1.getToken();
            try {
                data = operation.getContext().cache.readQuery({ query: current_user_graphql_1.default });
                user = data.currentUser;
                token = token || user.token;
            }
            catch (err) {
                /* pass */
            }
            if (token) {
                operation.setContext({
                    headers: {
                        authorization: "Bearer " + token
                    }
                });
            }
            return [2 /*return*/];
        });
    }); },
    onError: function (_a) {
        var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError;
        if (graphQLErrors) {
            console.log('Graphql Errors', graphQLErrors);
        }
        if (networkError) {
            console.log('Network Error', networkError);
        }
    },
    clientState: {
        defaults: {},
        resolvers: {
            User: {
                token: function () { return localStorage.getItem('token'); }
            }
        }
    }
});
ReactDOM.render(React.createElement(react_apollo_1.ApolloProvider, { client: client },
    React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(react_router_dom_1.Route, { path: "/", component: App_1.default }))), document.querySelector('#root'));
//# sourceMappingURL=index.js.map