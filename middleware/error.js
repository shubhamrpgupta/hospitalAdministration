const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error"

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(val => val.message);
        const errorMessage = errors.join('. ');
        const msg = `Invalid input data: ${errorMessage}`;
        err = new ErrorHandler(msg, 400);
    }
}