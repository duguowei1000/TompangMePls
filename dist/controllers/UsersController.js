"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSuggestions = exports.findUserChoice = exports.saveUserChoice = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const inviteLinkDB_1 = __importDefault(require("../models/inviteLinkDB"));
const router = express_1.default.Router();
const timeFunctions_1 = __importDefault(require("../data/timeFunctions"));
//test
// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
// const y
const x_ = new Date("2022-05-30T14:00:00.000Z");
console.log('datex', x_ - 1000000);
const xcv = x_ - 5400000;
const qwe = x_ - 5000000;
const zxc = x_ - 4000000;
const y_ = x_ - 300000;
console.log('datey', y_);
const z_ = x_ + 6000000;
console.log('datez', z_);
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    const existingChats = [
        {
            grpchatid: 427599753,
            enterAL: false,
            locationToMeet: "JE mrt",
            //username: { type: String, unique: true, required: true },
            timeslot: {
                date: x_ - 1000000,
                day: "Mon",
                timing: "1530"
            },
            invitedMembers: [
                {
                    username: "tuxedo",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: z_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                },
                {
                    username: "Coke",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: x_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            vacantCapacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
        },
        {
            grpchatid: 527599753,
            enterAL: false,
            locationToMeet: "JE mrt",
            //username: { type: String, unique: true, required: true },
            timeslot: {
                date: x_ - 3000000,
                day: "Mon",
                timing: "1530"
            },
            invitedMembers: [
                {
                    username: "tuxedo",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: z_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                },
                {
                    username: "Coke",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: x_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            vacantCapacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
        },
        {
            grpchatid: 327592353,
            enterAL: true,
            locationToMeet: "CCK Mrt",
            //username: { type: String, unique: true, required: true },
            timeslot: { date: x_, day: "Tues", timing: "1230pm" },
            invitedMembers: [
                {
                    username: "sprite",
                    isDriving: { exist: true, spareCapacity: 3 },
                    timeInvited: y_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }, {
                    username: "honeylemon",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: x_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            vacantCapacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
        }
    ];
    await inviteLinkDB_1.default.deleteMany({});
    await inviteLinkDB_1.default.insertMany(existingChats);
    res.json(existingChats);
});
//Criteria for suggestions : within 1.5 hrs of indicated time
const findSuggestions = async (session) => {
    console.log("sessionFindsuggestions", session);
    const enterAL = session.enterAL;
    const timeslotinDate = new Date(session.timeslot.date);
    timeslotinDate.getTime();
    console.log("getTimeFindsuggestionsfromtimeslot", timeslotinDate);
    //const locationToMeet = session.locationToMeet
    const isDriving = session.isDriving; //user is driver or not
    if (isDriving.exist) {
        const slotAvailable_D_EL = await inviteLinkDB_1.default.find({
            enterAL: enterAL
        });
        const filteredTimeArray = [];
        const finalFiltered = [];
        //filter time
        for (const obj of slotAvailable_D_EL) {
            const checkTime = (ms) => { return (timeslotinDate.getTime() - 5400000) && ms < (timeslotinDate.getTime() + 5400000); };
            // console.log("timeslotinDate",timeslotinDate)
            // console.log("timeslotinDate-5400000",timeslotinDate-5400000)
            // console.log("obj boolean",(checkTime(obj.timeslot.date)))
            // console.log("obj.timeslot.date.Gettime",(obj.timeslot.date.getTime()))
            if (checkTime(obj.timeslot.date.getTime())) {
                filteredTimeArray.push(obj);
            }
        }
        console.log("filteredTimeArray", filteredTimeArray);
        //filter driver
        for (const obj2 of filteredTimeArray) { //grps with no driver
            if (obj2.invitedMembers.every((drive) => drive.isDriving.exist === false)) {
                finalFiltered.push(obj2);
            }
        }
        console.log("finalFiltered", finalFiltered);
        return finalFiltered;
    }
    else if (!isDriving.exist) {
        const slotAvailable_ND = await inviteLinkDB_1.default.find({
            $and: [
                { enterAL: enterAL },
                { timeslot: { date: { $in: [timeslotinDate - 5400000, timeslotinDate + 5400000] } } },
                { vacantCapacity: { $gt: 0 } }
            ]
        });
        console.log("slotAvailable_ND", slotAvailable_ND);
        return slotAvailable_ND;
    }
};
exports.findSuggestions = findSuggestions;
//If no timeslot match the derived timeslot
const suggestSpecificTimeslot = (session) => {
    const rounded = (0, timeFunctions_1.default)(session.timeslot.date);
    const getHours = String(rounded.getHours());
    const getMins = String(rounded.getMinutes());
    const adjustMins = () => {
        if (getMins === "0") {
            return "00";
        }
        else {
            return getMins;
        }
    };
    // console.log(">>>>rounded",rounded )
    // console.log(">>>>getHours",getHours )
    // console.log(">>>>getMins",getMins )
    // console.log(">>>>hoursmins",getHours.concat(adjustMins()) )
    const array = [{
            enterAL: session.enterAL,
            locationToMeet: "JE Mrt",
            timeslot: {
                date: rounded,
                day: session.timeslot.day,
                timing: getHours.concat(adjustMins()) //string
            }
        },
        {
            enterAL: session.enterAL,
            locationToMeet: "CCK Mrt",
            timeslot: {
                date: rounded,
                day: session.timeslot.day,
                timing: getHours.concat(adjustMins()) //string
            }
        }];
    return array;
};
//Driver should not see another driver
const findUserChoice = async (session) => {
    const enterAL = session.enterAL;
    const locationToMeet = session.locationToMeet;
    const isDriving = session.isDriving; //user is driver or not
    const timeslot = session.timeslot.date;
    const derivedTime = (0, timeFunctions_1.default)(timeslot);
    console.log("derivedTime", derivedTime);
    const suggestions = await findSuggestions(session); //Specifically timeslots existing in database relaxed criterion <timeslot within 90mins>
    console.log("suggestions", suggestions);
    if (isDriving.exist) {
        const specificSlotAvailable_D = await inviteLinkDB_1.default.findOne({
            $and: [
                { isDriving: { exist: false } },
                { enterAL: enterAL },
                { timeslot: derivedTime },
                { locationToMeet: locationToMeet }
            ]
        });
        console.log("specificSlotAvailable", specificSlotAvailable_D);
        if (!specificSlotAvailable_D) // no rooms that match, need create for next step**
         {
            // console.log("suggested addtional",suggestSpecificTimeslot(session))
            const suggestUserSpecificSlot = suggestSpecificTimeslot(session);
            return [...suggestions, ...suggestUserSpecificSlot]; //collate all suggestions
        }
    }
    else if (!isDriving.exist) {
        const specificSlotAvailable_ND = await inviteLinkDB_1.default.findOne({
            $and: [
                { enterAL: enterAL },
                { timeslot: derivedTime },
                { locationToMeet: locationToMeet }
            ]
        });
        if (!specificSlotAvailable_ND) // no rooms that match, need create for next step**
         {
            // console.log("suggested addtional",suggestSpecificTimeslot(session))
            const suggestUserSpecificSlot = suggestSpecificTimeslot(session);
            return [...suggestions, ...suggestUserSpecificSlot]; //collate all suggestions
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
