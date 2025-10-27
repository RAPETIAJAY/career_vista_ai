"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware to validate request data using express-validator
 * Checks for validation errors and returns a 400 response if any are found
 */
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    next();
};
exports.validateRequest = validateRequest;
