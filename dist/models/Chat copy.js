"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    chatid: { type: Number, unique: true },
    //username: { type: String, unique: true, required: true },
    timeslot: { type: Date },
    members: [{ type: String }],
    location: { type: String }
});
const Chat = mongoose_1.default.model("chat", chatSchema);
exports.default = Chat;
// module.exports = Chat;
