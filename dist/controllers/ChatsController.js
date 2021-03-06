"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chat_1 = __importDefault(require("../models/Chat"));
const router = express_1.default.Router();
// const bcrypt = require("bcrypt");
const grplinks_1 = __importDefault(require("../grpdata/grplinks"));
router.get("/seed", async (req, res) => {
    try {
        const chatList = [
            {
                chatid: grplinks_1.default[0].id,
                invitelink: grplinks_1.default[0].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[1].id,
                invitelink: grplinks_1.default[1].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[2].id,
                invitelink: grplinks_1.default[2].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[3].id,
                invitelink: grplinks_1.default[3].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[4].id,
                invitelink: grplinks_1.default[4].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[5].id,
                invitelink: grplinks_1.default[5].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[6].id,
                invitelink: grplinks_1.default[6].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[0].id,
                invitelink: grplinks_1.default[0].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[7].id,
                invitelink: grplinks_1.default[7].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[8].id,
                invitelink: grplinks_1.default[8].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[9].id,
                invitelink: grplinks_1.default[9].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[10].id,
                invitelink: grplinks_1.default[10].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "",
                membersInside: []
            }
        ];
        await Chat_1.default.deleteMany({});
        await Chat_1.default.insertMany(chatList);
        res.json(chatList);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
