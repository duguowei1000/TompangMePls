"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    chats: [{
            chatids: [{ type: Number, unique: true }],
            enterAL: { type: Boolean },
            locationToMeet: { type: String },
            //username: { type: String, unique: true, required: true },
            timeslot: { type: Date },
            membersInside: [
                {
                    username: { type: String },
                    isDriving: { exist: { type: Boolean }, spareCapacity: { type: Number } },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            // If pax left, to update inviteLinkDB.chats.capacity immediately
        }]
});
const Chat = mongoose_1.default.model("chat", chatSchema);
exports.default = Chat;
// module.exports = Chat;
