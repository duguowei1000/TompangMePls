"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const InviteDBSchema = new mongoose_1.default.Schema({
    grpchatid: { type: Number },
    enterAL: { type: Boolean },
    locationToMeet: { type: String },
    //username: { type: String, unique: true, required: true },
    timeslot: { date: { type: Date }, day: { type: String }, timing: { type: String } },
    invitedMembers: [
        {
            username: { type: String },
            isDriving: { exist: { type: Boolean }, spareCapacity: { type: Number } },
            timeInvited: { type: Date },
            timeToExpire: { type: Date },
            //Derived time to delete member invite if no news after 3mins
        }
    ],
    vacantCapacity: { type: Number },
    invitelink: { type: String },
});
const InviteDB = mongoose_1.default.model("InviteDB", InviteDBSchema);
exports.default = InviteDB;
// module.exports = Chat;
