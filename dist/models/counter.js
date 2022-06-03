"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    chatid: { type: Number },
    username: { type: String },
    enterAL: { type: Boolean },
    timeslot: { type: Date },
    locationToMeet: { type: String },
    counter: { type: Number }
});
const Counter = mongoose_1.default.model("Counter", counterSchema);
exports.default = Counter;
