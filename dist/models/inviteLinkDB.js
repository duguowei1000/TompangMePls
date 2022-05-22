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
            invitedMembers: [
                {
                    username: { type: String },
                    isDriving: { exist: { type: Boolean }, spareCapacity: { type: Number } },
                    timeInvited: { type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            capacity: { type: Number } //total capacity = Driver + spareCapacity //OR carpool (4pax)
        }
    ]
});
const Chat = mongoose_1.default.model("chat", chatSchema);
exports.default = Chat;
// module.exports = Chat;
