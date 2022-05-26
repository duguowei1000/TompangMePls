"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserChoice = exports.saveUserChoice = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const inviteLinkDB_1 = __importDefault(require("../models/inviteLinkDB"));
const router = express_1.default.Router();
const invitedata_1 = require("../data/invitedata");
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await inviteLinkDB_1.default.deleteMany({});
        // await InviteDB.create(
        //   [
        //   ]
        // );
        res.send("Users Seed");
    }
    catch (error) {
        console.log(error);
    }
});
//Driver should not see another driver
const findUserChoice = async (session) => {
    console.log("session", session);
    const enterAL = session.enterAL;
    const timeslot = session.timeslot;
    const locationToMeet = session.locationToMeet;
    const isDriving = session.isDriving; //user is driver or not
    if (isDriving.exist) {
        const specificSlotAvailable = await inviteLinkDB_1.default.findOne({
            $and: [
                { isDriving: { exist: false } },
                { enterAL: enterAL },
                { timeslot: timeslot },
                { locationToMeet: { locationToMeet: locationToMeet } }
            ]
        });
        console.log("specificSlotAvailable", specificSlotAvailable);
        if (!specificSlotAvailable) // no rooms that match, need create for next step**
         {
            console.log("suggested addtional", (0, invitedata_1.suggestSpecificTimeslot)(session));
            const suggestUserSpecificSlot = (0, invitedata_1.suggestSpecificTimeslot)(session);
            return [...suggestUserSpecificSlot, ...invitedata_1.suggestions];
            console.log("suggested ", invitedata_1.suggestions);
        }
    }
};
exports.findUserChoice = findUserChoice;
const saveUserChoice = async (ctxt, selectedSlot) => {
    const enterAL = selectedSlot.enterAL;
    const timeslot = selectedSlot.timeslot;
    const locationToMeet = selectedSlot.locationToMeet;
    const isDriving = selectedSlot.isDriving;
    console.log('selectedSlot', selectedSlot);
    try {
        const user = await inviteLinkDB_1.default.find({ invitedMembers: [{ username: ctxt.chat.username }] });
        const specificSlot = await inviteLinkDB_1.default.find({
            $and: [
                { timeslot: { date: date } },
                { locationToMeet: { locationToMeet: locationToMeet } }
            ]
        });
        const userName = user[0].username; //await User.findOne({ username: ctxt.chat.username });
        const userlocationToMeet = user[0].locationToMeet; //await User.findOne({ destination: destinationChoice });
        const time = user[0].timeslot; //await User.findOne({ timeslot: time });
        // if(userlocationToMeet === destinationChoice){ return console.log(userDestination)}
        // console.log(`userName${userName} && userDest${userDestination} && time ${time}` )
        // if (userName && userDestination){
        //   await ctxt.reply(`You have already chosen a ${userDestination}, update your choice?`)//, { reply_markup: timeMenu });
        //   console.log(`You have already chosen a ${userDestination}, update your choice?`) ;
        // } 
        console.log("userdata", user);
        console.log("userdata", specificSlot);
        if (userName) { ///should not happen
            console.log(`userName${userName} && userDest${userlocationToMeet} && time ${time} , please press /start to update`);
            ctxt.reply(`You already chose ${time} && userDest${userlocationToMeet} , please press /start to update`);
        }
        else if (!specificSlot) { //create that specific timeslot for the user if no existing
            const totalCapacity = () => {
                if (isDriving.exist)
                    return isDriving.spareCapacity;
                else
                    return 4;
            }; //OR carpool (4pax)
            const addMemberToTimeslot = {
                grpchatid: `grpchatid from chats`,
                enterAL: enterAL,
                locationToMeet: locationToMeet,
                timeslot: timeslot,
                invitedMembers: [
                    {
                        username: `${ctxt.chat.username}`,
                        isDriving: false,
                        timeInvited: Date.now(),
                        timeToExpire: Date.now() //+ 3mins
                        //Derived time to delete member invite if no news after 3mins
                    }
                ],
                capacity: totalCapacity() //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
            };
            const createdTimeslot = await inviteLinkDB_1.default.create(addMemberToTimeslot);
            console.log("created New entry to DB", createdTimeslot);
        }
    }
    catch (error) {
        console.log("try error");
    }
};
exports.saveUserChoice = saveUserChoice;
// await outputSuggestedMRT(ctxt)
router.post("/", async (req, res) => {
    // console.log("req.body", req.body);
    try {
        const createdListing = await User_1.default.create(req.body);
        const lister = await User_1.default.findOne({ username: req.body.lister });
        lister.listings.push(createdListing._id);
        await lister.save();
        res.status(200).send(createdListing);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//console.log(StatusCodes.UNAUTHORISED)
// //* see login form
// router.get("/form", (req, res) => {
//     res.render("login.ejs");
// });
// ////
// const isAuth = (req,res,next) => {
//   console.log(req.session.id)
//   if(req.session.isLoggedIn === false){
//     res.send("its false")
//   }
//   if(req.session.isLoggedIn){
//     next()
//     console.log("next")
//   }else {
//     // res
//       //.status(StatusCodes.UNAUTHORISED)
//       //.send({ error: getReasonPhrase(StatusCodes.UNAUTHORISED)})
//       res.status(401)
//   }
// }
// router.get("/secret", isAuth,(req, res) => {
//     const user = req.session.user;
//     console.log('session.user',user)
//     if (user) {
//       // res.redirect("/users/form")
//       console.log('sessionid',req.session.id)
//       res.send(user)
//       console.log(req.session.isLoggedIn)
//     } else {
//       res.send("no entry")
//     }
// })
// router.get("/secret2", (req, res) => {
//     const count = req.session.count;
//     req.session.count = req.session.count + 1;
//     res.send("count" + count)
//     //res.send("isLogged in" + req.session.isLoggedIn)
//   })
// //* login route
// router.post("/login", async (req, res) => {
//   console.log(req.body)
//     const { username, password} = req.body;
//     // const hashPassword = bcrypt.hashSync(password, saltRounds);
//     const user = await User.findOne({ username });
//     if (!user) {
//         res.send("User not found");
//     } else if (bcrypt.compareSync(password, user.password)) {
//       req.session.user = user;
//       req.session.isLoggedIn = true; ////
//       //console.log(req.session.isLoggedIn)
//       //res.send(req.session.user)
//       res.send("Ok");
//     } else {
//       res.send("No")
//     }
//   // res.send(user);
//   //* success or failure
// });
// router.get("/logout", (req, res) => {
//     req.session.destroy();
//     res.send("logout")
//   })
// module.exports = router;
