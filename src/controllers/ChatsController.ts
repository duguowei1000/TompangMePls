import express from "express";
import Chat from "../models/Chat";
import InviteDB from "../models/inviteLinkDB";
const router = express.Router();
// const bcrypt = require("bcrypt");
import links from "../grpdata/grplinks"

console.log("links",links)
// const saltRounds = 10;
router.get("/seed", async (req, res) => {

    console.log("links[0].id",links[0].id,"links[0].invitelink",links[0].invitelink)
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
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: [            
                    { 
                    username: "mrdgw",
                    isDriving:{ exist: null , spareCapacity:null }
                }
                ]
            
            },            
            {
                chatid: links[2].id,
                invitelink: links[2].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: [            
                    { 
                    username: "testingGW",
                    //isDriving:{ exist: null , spareCapacity:null }
                }
                ]
            },
            {
                chatid: links[3].id,
                invitelink: links[3].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[4].id,
                invitelink: links[4].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[5].id,
                invitelink: links[5].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[6].id,
                invitelink: links[6].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[7].id,
                invitelink: links[7].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[8].id,
                invitelink: links[8].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[9].id,
                invitelink: links[9].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            },
            {
                chatid: links[10].id,
                invitelink: links[10].invitelink,
                //username: { type: String, unique: true, required: true },
                enterAL: null,
                locationToMeet: "CCK Mrt",
                timeslot: "2022-06-03T14:00:00.000Z", //, default: Date.now 
                membersInside: []
            }
        ]
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


    await Chat.deleteMany({});
    await Chat.insertMany(chatList);
    res.json(chatList);
  } catch (error) {
        console.log(error);
    }
})

export default router;