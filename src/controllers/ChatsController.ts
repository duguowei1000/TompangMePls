import express from "express";
import Chat from "../models/Chat";
const router = express.Router();
// const bcrypt = require("bcrypt");
import links from "../grpdata/grplinks"
router.get("/seed", async (req, res) => {

    try {
            const chatList = [

            {
                chatid: links[0].id,
                invitelink: links[0].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },         
            {
                chatid: links[1].id,
                invitelink: links[1].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            
            },            
            {
                chatid: links[2].id,
                invitelink: links[2].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[3].id,
                invitelink: links[3].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[4].id,
                invitelink: links[4].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[5].id,
                invitelink: links[5].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[6].id,
                invitelink: links[6].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[0].id,
                invitelink: links[0].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[7].id,
                invitelink: links[7].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[8].id,
                invitelink: links[8].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[9].id,
                invitelink: links[9].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[10].id,
                invitelink: links[10].invitelink,
                enterAL: null,
                locationToMeet: "",
                timeslot: "", //, default: Date.now 
                membersInside: []
            }
        ]


    await Chat.deleteMany({});
    await Chat.insertMany(chatList);
    res.json(chatList);
  } catch (error) {
        console.log(error);
    }
})

export default router;