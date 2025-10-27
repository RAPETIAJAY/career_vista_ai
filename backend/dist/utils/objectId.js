"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.isValidObjectId = void 0;
const mongoose_1 = require("mongoose");
const isValidObjectId = (id) => {
    return mongoose_1.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
const toObjectId = (id) => {
    return new mongoose_1.Types.ObjectId(id);
};
exports.toObjectId = toObjectId;
