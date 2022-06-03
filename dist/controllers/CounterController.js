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
    try {
        const count = [
            {
                chatid: null,
                invitelink: null,
                enterAL: null,
                timeslot: "",
                locationToMeet: "",
                counter: 0
            }
        ];
        await Chat_1.default.deleteMany({});
        await Chat_1.default.insertMany(count);
        res.json(count);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
