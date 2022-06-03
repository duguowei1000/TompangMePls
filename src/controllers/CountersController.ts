import express from "express";
import Counter from "../models/counter";
const router = express.Router();
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
            }      ]

    await Counter.deleteMany({});
    await Counter.insertMany(count);
    res.json(count);
  } catch (error) {
        console.log(error);
    }
})

export default router;