"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chat_1 = __importDefault(require("../models/Chat"));
const router = express_1.default.Router();
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await Chat_1.default.deleteMany({});
        await Chat_1.default.create([
            {
                chatid: 123213,
                //username: { type: String, unique: true, required: true },
                timeslot: "Tuesday 1030",
                members: ["mrdgw", "testingGW"],
                location: "Bukit Batok"
            },
            {
                chatid: 123768,
                //username: { type: String, unique: true, required: true },
                timeslot: "Wed 1030",
                members: ["tuxedo", "person2"],
                location: "Bukit Batok"
            },
        ]);
        res.send("Chat Seeded");
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
