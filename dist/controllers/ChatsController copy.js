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
console.log("links", grplinks_1.default);
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    console.log("links[0].id", grplinks_1.default[0].id, "links[0].invitelink", grplinks_1.default[0].invitelink);
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
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: [
                    {
                        username: "mrdgw",
                        isDriving: { exist: null, spareCapacity: null }
                    }
                ]
            },
            {
                chatid: grplinks_1.default[2].id,
                invitelink: grplinks_1.default[2].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: [
                    {
                        username: "testingGW",
                        //isDriving:{ exist: null , spareCapacity:null }
                    }
                ]
            },
            {
                chatid: grplinks_1.default[3].id,
                invitelink: grplinks_1.default[3].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[4].id,
                invitelink: grplinks_1.default[4].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[5].id,
                invitelink: grplinks_1.default[5].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[6].id,
                invitelink: grplinks_1.default[6].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[7].id,
                invitelink: grplinks_1.default[7].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[8].id,
                invitelink: grplinks_1.default[8].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[9].id,
                invitelink: grplinks_1.default[9].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            },
            {
                chatid: grplinks_1.default[10].id,
                invitelink: grplinks_1.default[10].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z",
                membersInside: []
            }
        ];
        // {
        //     chatid: { type: Number, unique: true },
        //     invitelink: { type: String },
        //     enterAL: { type: Boolean },
        //     locationToMeet: { type: String },
        //     //username: { type: String, unique: true, required: true },
        //     timeslot: { type: Date }, //, default: Date.now 
        //     membersInside: [
        //         {
        //             username: { type: String },
        //             isDriving: { exist: { type: Boolean }, spareCapacity: { type: Number } },
        //             //Derived time to delete member invite if no news after 3mins
        //         }]
        // }
        await Chat_1.default.deleteMany({});
        await Chat_1.default.insertMany(chatList);
        res.json(chatList);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
