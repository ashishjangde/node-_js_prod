"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var ApiError_js_1 = require("../utils/ApiError.js");
var ApiResponse_js_1 = require("../utils/ApiResponse.js");
var errorMiddleware = function (err, req, res, next) {
    if (err instanceof ApiError_js_1.default) {
        res.status(err.statusCode).json(new ApiResponse_js_1.default(null, new ApiError_js_1.default(err.statusCode, err.message, err.errors)));
    }
    else {
        console.error(err);
        res.status(500).json(new ApiResponse_js_1.default(null, new ApiError_js_1.default(500, 'Internal Server Error')));
    }
};
exports.errorMiddleware = errorMiddleware;
