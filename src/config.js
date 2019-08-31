"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = REACT_APP_ENV === 'production';
exports.isRelease = REACT_APP_ENV === 'release';
var baseUrl = 'http://localhost:3000';
if (exports.isProduction) {
    baseUrl = 'http://139.59.18.155:3000';
}
if (exports.isRelease) {
    baseUrl = 'http://159.65.145.144:3000';
}
exports.imagePath = function (image) {
    return image ? baseUrl + "/static/images/" + image : '';
};
exports.apiUrls = {
    uploadedImage: function (name) { return (name ? baseUrl + "/static/images/" + name : ''); },
    uploadImage: baseUrl + "/upload-image",
    graphql: baseUrl
};
//# sourceMappingURL=config.js.map