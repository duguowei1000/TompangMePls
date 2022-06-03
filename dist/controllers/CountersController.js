"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const counter_1 = __importDefault(require("../models/counter"));
const router = express_1.default.Router();
// const bcrypt = require("bcrypt");
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
        await counter_1.default.deleteMany({});
        await counter_1.default.insertMany(count);
        res.json(count);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
