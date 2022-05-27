import express from "express";
import Chat from "../models/Chat";
import InviteDB from "../models/inviteLinkDB";
const router = express.Router();
// const bcrypt = require("bcrypt");


// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await Chat.deleteMany({})
        await Chat.create([
          {
            chatid: 123213,
            //username: { type: String, unique: true, required: true },
            timeslot: "Tuesday 1030", //, default: Date.now 
            members: ["mrdgw", "testingGW"],
            location: "Bukit Batok"
          },
          {
            chatid: 123768,
            //username: { type: String, unique: true, required: true },
            timeslot: "Wed 1030", //, default: Date.now 
            members: ["tuxedo", "person2"],
            location: "Bukit Batok"
          },
        ]);
        res.send("Chat Seeded")
      } catch (error) {
          console.log(error);
      }
})

export default router;