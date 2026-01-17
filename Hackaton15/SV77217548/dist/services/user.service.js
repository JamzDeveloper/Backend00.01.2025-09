"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const createUser = (payload) => user_model_1.default.create(payload);
exports.createUser = createUser;
const findUserByEmail = (email) => user_model_1.default.findOne({ email });
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => user_model_1.default.findById(id);
exports.findUserById = findUserById;
