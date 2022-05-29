"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSuggestions = exports.getRounded24HrsString = exports.findUserChoice = exports.saveUserChoice = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const inviteLinkDB_1 = __importDefault(require("../models/inviteLinkDB"));
const router = express_1.default.Router();
const timeFunctions_1 = __importDefault(require("../data/timeFunctions"));
const arrays_1 = require("../data/arrays");
const arrays_2 = __importDefault(require("../data/arrays"));
const dateConvert = (ms) => {
    return new Date(ms);
};
const getRounded24HrsString = (date) => {
    const rounded = (0, timeFunctions_1.default)(date);
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
    return getHours.concat(adjustMins());
};
exports.getRounded24HrsString = getRounded24HrsString;
///INPUT time to test for database
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
                date: x_ - 2000000,
                day: "Mon",
                timing: getRounded24HrsString(dateConvert(x_ - 2000000))
            },
            invitedMembers: [
                {
                    username: "mrdgw",
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
            vacantCapacity: 4,
            invitelink: "https://t.me/+bRjtUKOXVtVhZjM1"
        },
        {
            grpchatid: 527599753,
            enterAL: false,
            locationToMeet: "CCK mrt",
            //username: { type: String, unique: true, required: true },
            timeslot: {
                date: x_ - 1000000,
                day: "Mon",
                timing: getRounded24HrsString(dateConvert(x_ - 1000000))
            },
            invitedMembers: [
                {
                    username: "sketches",
                    isDriving: { exist: false, spareCapacity: null },
                    timeInvited: z_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                },
                {
                    username: "berry",
                    isDriving: { exist: true, spareCapacity: 3 },
                    timeInvited: x_ //{ type: Date },
                    //Derived time to delete member invite if no news after 3mins
                }
            ],
            vacantCapacity: 2,
            invitelink: "https://t.me/+bRjtUKOXVtVhZjM1"
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
            vacantCapacity: 4,
            invitelink: "https://t.me/+bRjtUKOXVtVhZjM1"
        }
    ];
    await inviteLinkDB_1.default.deleteMany({});
    await inviteLinkDB_1.default.insertMany(existingChats);
    res.json(existingChats);
});
//Criteria for suggestions : within 1.5 hrs of indicated time
const findLaxSuggestions = async (session) => {
    const enterAL = session.enterAL;
    const timeslotinDate = new Date(session.timeslot.date);
    timeslotinDate.getTime();
    console.log("getTimeFindsuggestionsfromtimeslot", timeslotinDate);
    //const locationToMeet = session.locationToMeet
    const isDriving = session.isDriving; //user is driver or not
    const checkTime = (ms) => { return (timeslotinDate.getTime() - 5400000) && ms < (timeslotinDate.getTime() + 5400000); };
    const filteredTimeArray = [];
    const finalFiltered = [];
    if (isDriving.exist) {
        const slotAvailable_D_EL = await inviteLinkDB_1.default.find({
            $and: [
                { enterAL: enterAL },
                { vacantCapacity: { $gt: 0 } }
            ]
        });
        //filter time
        for (const obj of slotAvailable_D_EL) {
            // console.log("timeslotinDate",timeslotinDate)
            // console.log("timeslotinDate-5400000",timeslotinDate-5400000)
            // console.log("obj boolean",(checkTime(obj.timeslot.date)))
            // console.log("obj.timeslot.date.Gettime",(obj.timeslot.date.getTime()))
            if (checkTime(obj.timeslot.date.getTime())) {
                filteredTimeArray.push(obj);
            }
        }
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
                { vacantCapacity: { $gt: 0 } }
            ]
        });
        //filter time
        for (const obj of slotAvailable_ND) {
            if (checkTime(obj.timeslot.date.getTime())) {
                finalFiltered.push(obj);
            }
        }
        console.log("finalFilterednodriverHere", finalFiltered);
        return finalFiltered;
    }
};
//If no timeslot match the derived timeslot
const suggestSpecificTimeslot = (session) => {
    const rounded = (0, timeFunctions_1.default)(session.timeslot.date);
    const array = [{
            enterAL: session.enterAL,
            locationToMeet: "JE Mrt",
            timeslot: {
                date: rounded,
                day: session.timeslot.day,
                timing: getRounded24HrsString(session.timeslot.date) //string
            }
        },
        {
            enterAL: session.enterAL,
            locationToMeet: "CCK Mrt",
            timeslot: {
                date: rounded,
                day: session.timeslot.day,
                timing: getRounded24HrsString(session.timeslot.date) //string
            }
        }];
    return array;
};
//Driver should not see another driver
const findUserChoice = async (session) => {
    // const enterAL = session.enterAL
    // const locationToMeet = session.locationToMeet
    // const isDriving = session.isDriving //user is driver or not
    const timeslot = session.timeslot.date;
    const derivedTime = (0, timeFunctions_1.default)(timeslot);
    console.log("derivedTime", derivedTime);
    console.log("derivedTimegetTime", derivedTime.getTime());
    const laxSuggestions = await findLaxSuggestions(session); //Specifically timeslots existing in database relaxed criterion <timeslot within 90mins>
    console.log("suggestions", laxSuggestions);
    /////CREATE TIMESLOT IF NO EXACT TIMESLOT FOUND IN DATABASE
    const finalSuggestion = async () => {
        const checkExactTimeExist = laxSuggestions.some((ti) => { return ((ti.timeslot.date.getTime() === derivedTime.getTime())); });
        console.log("checkExactTimeExist", checkExactTimeExist);
        if (!checkExactTimeExist) {
            return [...laxSuggestions, ...suggestSpecificTimeslot(session)];
        }
        else
            return laxSuggestions;
    };
    const completeSuggestions = await finalSuggestion();
    return completeSuggestions;
};
exports.findUserChoice = findUserChoice;
const saveUserChoice = async (ctxt, selectedSlot) => {
    const enterAL = selectedSlot.enterAL;
    const timeslot = selectedSlot.timeslot;
    const locationToMeet = selectedSlot.locationToMeet;
    // const isDriving = selectedSlot.isDriving
    const userIsDriver = ctxt.session.isDriving;
    console.log('selectedSlot', selectedSlot);
    console.log("ctxt.chat.username ", ctxt.chat.username);
    try {
        const user = await inviteLinkDB_1.default.findOne({ invitedMembers: { $elemMatch: { username: ctxt.chat.username } } });
        const totalCapacity = () => {
            if (userIsDriver)
                return userIsDriver.spareCapacity; //OR Driver capacity
            else
                return (4 - 1); //4 carpoolers - the user
        };
        if (user) { ///should not happen.
            console.log("user", user);
            const userName = user.invitedMembers[0]?.username; //await User.findOne({ username: ctxt.chat.username });
            const userlocationToMeet = user.locationToMeet; //await User.findOne({ destination: destinationChoice });
            const timeDate = user.timeslot.date.getDate(); //await User.findOne({ timeslot: time });
            const timeMth = user.timeslot.date.getMonth();
            const timeDay = user.timeslot.date.getDay();
            const timeSlot = user.timeslot.timing;
            const inviteLink = user.invitelink;
            console.log(`userName${userName} && userDest${userlocationToMeet} && time ${timeSlot} ${inviteLink} , please press /start to update`);
            // await ctxt.reply("hi")
            await ctxt.reply(`You already chose ${timeDate} ${arrays_1.monthsArray[timeMth]}${arrays_2.default[timeDay]} ${timeSlot}hrs with this invite link ${inviteLink}, please press /start to update`);
        }
        else if (!user) {
            //const timeNow3mins = Date.now() +180000
            // console.log(timeNow3mins)
            //Add new slot
            const addTimeslot = {
                grpchatid: -705354562,
                enterAL: enterAL,
                locationToMeet: locationToMeet,
                timeslot: timeslot,
                invitedMembers: [
                    {
                        username: ctxt.session.username,
                        isDriving: ctxt.session.isDriving,
                        timeInvited: Date.now(),
                        timeToExpire: Date.now() + 180000 //+ 3mins
                        //Derived time to delete member invite if no news after 3mins
                    }
                ],
                inviteLink: "https://t.me/+bRjtUKOXVtVhZjM1",
                vacantCapacity: totalCapacity(), //toupdate constantly at group side
            };
            const createdTimeslot = await inviteLinkDB_1.default.create(addTimeslot);
            console.log("created New entry to DB", createdTimeslot);
            //Update existing slot
            console.log("hi");
            // return 'hi' 
        }
        // else if (!specificSlot) {         //create that specific timeslot for the user if no existing
        // const totalCapacity = () => {
        //   if (userIsDriver) return userIsDriver.spareCapacity
        //   else return user.
        // }//OR carpool (4pax)
        // const updateMemberToTimeslot = {
        //   grpchatid: `grpchatid from chats`,//[{ type: Number, unique: true }],
        //   enterAL: enterAL,//{type: Boolean},
        //   locationToMeet: locationToMeet,//{type: String},
        //   timeslot: timeslot,//{ type: Date }, //, default: Date.now 
        //   invitedMembers: [
        //     {
        //       username: `${ctxt.chat.username}`,//{ type: String },
        //       isDriving: false,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        //       timeInvited: Date.now(),//{ type: Date },
        //       timeToExpire: Date.now() //+ 3mins
        //       //Derived time to delete member invite if no news after 3mins
        //     }],
        //     vacantCapacity: totalCapacity()//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
        //     inviteLink: inviteLink
        // }
        // const createdTimeslot = await InviteDB.create(updateMemberToTimeslot);
        // console.log("created New entry to DB", createdTimeslot)
    }
    catch (error) {
        console.log("try error");
        console.log(error);
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
