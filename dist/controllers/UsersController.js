"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSuggestions = exports.getRounded24HrsString = exports.findUserChoice = exports.saveUserChoice = void 0;
const express_1 = __importDefault(require("express"));
const inviteLinkDB_1 = __importDefault(require("../models/inviteLinkDB"));
const router = express_1.default.Router();
const timeFunctions_1 = __importDefault(require("../data/timeFunctions"));
const arrays_1 = require("../data/arrays");
const arrays_2 = __importDefault(require("../data/arrays"));
const grplinks_1 = __importDefault(require("../grpdata/grplinks"));
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
const x_ = new Date("2022-06-01T14:00:00.000Z");
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
                day: arrays_2.default[dateConvert(x_ - 2000000).getDay()],
                timing: getRounded24HrsString(dateConvert(x_ - 2000000))
            },
            invitedMembers: [
                {
                    username: "cloud",
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
                day: arrays_2.default[dateConvert(x_ - 1000000).getDay()],
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
        // {
        //   grpchatid: 327592353,//[{ type: Number, unique: true }],
        //   enterAL: true,//{type: Boolean},
        //   locationToMeet: "CCK Mrt",//{type: String},
        //   //username: { type: String, unique: true, required: true },
        //   timeslot: {
        //     date: x_,
        //     day: integerToDay[dateConvert(x_).getDay()],
        //     timing: getRounded24HrsString(dateConvert(x_))
        //   },//{ type: Date }, //, default: Date.now 
        //   invitedMembers: [
        //     {
        //       username: "sprite",//{ type: String },
        //       isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        //       timeInvited: y_//{ type: Date },
        //       //Derived time to delete member invite if no news after 3mins
        //     }, {
        //       username: "honeylemon",//{ type: String },
        //       isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        //       timeInvited: x_//{ type: Date },
        //       //Derived time to delete member invite if no news after 3mins
        //     }
        //   ],
        //   vacantCapacity: 4,//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
        //   invitelink: "https://t.me/+bRjtUKOXVtVhZjM1"
        // }
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
const suggestSpecificTimeslot = (session, derivedTime, laxsuggest, checkExactTimeexist) => {
    const rounded = (0, timeFunctions_1.default)(session.timeslot.date);
    const checkLocationExisting = laxsuggest.filter((ti) => {
        if (ti.timeslot.date.getTime() === derivedTime.getTime()) {
            return true;
        }
    });
    console.log("checkLocationExisting>>>>", checkLocationExisting);
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
    if (checkExactTimeexist) {
        if (checkLocationExisting.length > 1)
            return []; ///this is just a bandaid => if JE and CCK is present (vacancy gte >0), dont pass specific timeslot
        else if (checkLocationExisting[0].locationToMeet === "JE Mrt") {
            console.log("array.slice(-1)", array.slice(-1));
            return array.slice(-1);
        }
        else if (checkLocationExisting[0].locationToMeet === "CCK Mrt") {
            console.log("array.slice(0,1)", array.slice(0, 1));
            return array.slice(0, 1);
        }
    }
    else
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
    console.log("laxsuggestions", laxSuggestions);
    /////CREATE TIMESLOT IF NO EXACT TIMESLOT FOUND IN DATABASE
    const finalSuggestion = async () => {
        const checkExactTimeExist = laxSuggestions.some((ti) => { return ((ti.timeslot.date.getTime() === derivedTime.getTime())); });
        console.log("suggestSpecificTimeslot(session,laxSuggestions,checkExactTimeExist)", suggestSpecificTimeslot(session, derivedTime, laxSuggestions, checkExactTimeExist));
        return [...laxSuggestions, ...suggestSpecificTimeslot(session, derivedTime, laxSuggestions, checkExactTimeExist)];
    };
    const completeSuggestions = await finalSuggestion();
    return completeSuggestions;
};
exports.findUserChoice = findUserChoice;
const totalCapacity = (isDrive) => {
    const { exist, spareCapacity } = isDrive;
    console.log("isDrive", exist);
    console.log("isDrivespareCapacity", spareCapacity);
    if (exist)
        return spareCapacity; //OR Driver capacity
    else
        return (4 - 1); //4 carpoolers - the user
};
const updateCapacity = (isDrive, totalmembers, driverCap) => {
    const { exist, spareCapacity } = isDrive;
    console.log("isDrive", exist);
    console.log("isDrivespareCapacity", spareCapacity);
    if (exist)
        return spareCapacity - (totalmembers - 1); //Sparecap - members exclude driver
    else if (!exist && driverCap > 0) {
        return driverCap - (totalmembers - 1);
    } //Max carpool - final total members //+ case where user is not driver but grp has driver
    else if (!exist) {
        return 4 - totalmembers;
    }
};
const saveUserChoice = async (ctxt, selectedSlot) => {
    const enterAL = selectedSlot.enterAL;
    const timeslot_ = selectedSlot.timeslot.date;
    console.log("selectedSlot.timeslot.date", selectedSlot.timeslot.date);
    const locationToMeet = selectedSlot.locationToMeet;
    // const isDriving = selectedSlot.isDriving
    const userIsDriver = ctxt.session.isDriving;
    console.log('selectedSlot', selectedSlot);
    console.log("ctxt.chat.username ", ctxt.chat.username);
    try {
        const user = await inviteLinkDB_1.default.findOne({ invitedMembers: { $elemMatch: { username: ctxt.chat.username } } });
        if (user) { ///should not happen.
            console.log("user", user);
            const userName = user.invitedMembers[0]?.username; //await User.findOne({ username: ctxt.chat.username });
            const userlocationToMeet = user.locationToMeet; //await User.findOne({ destination: destinationChoice });
            const timeDate = user.timeslot.date.getDate(); //await User.findOne({ timeslot: time });
            const timeMth = user.timeslot.date.getMonth();
            const timeDay = user.timeslot.date.getDay();
            const timeTiming = user.timeslot.timing;
            const inviteLink = user.invitelink;
            console.log(`userName${userName} && userDest${userlocationToMeet} && time ${timeTiming} ${inviteLink} , please press /start to update`);
            // await ctxt.reply("hi")
            await ctxt.reply(`You already chose ${timeDate} ${arrays_1.monthsArray[timeMth]}${arrays_2.default[timeDay]} ${timeTiming}hrs with this invite link ${inviteLink}, please press /start to update`);
        }
        else if (!user) { //ADD SLOT OR UPDATE SLOT
            const timeNow3mins = new Date(Date.now() + 180000);
            const findExistingSlot_final = [];
            const findExistingSlot = await inviteLinkDB_1.default.find({
                $and: [
                    { enterAL: enterAL },
                    { locationToMeet: locationToMeet },
                    { vacantCapacity: { $gt: 0 } },
                    { $match: { _id: 0, timeslot: { date: new Date(timeslot_) } } },
                ]
            });
            console.log("findExistingSlot", findExistingSlot);
            const findExisting = async (userdriver) => {
                if (!userdriver)
                    return findExistingSlot;
                else if (userdriver) {
                    for (const obj4 of findExistingSlot) { //grps with no driver
                        if (obj4.invitedMembers.every((drive) => drive.isDriving.exist === false)) {
                            findExistingSlot_final.push(obj4);
                        }
                        console.log("findExistingSlot_final", findExistingSlot_final);
                        return findExistingSlot_final;
                    }
                }
            };
            const openSlotToUpdate = await findExisting(userIsDriver.exist);
            if (openSlotToUpdate?.length) { //find slot chosen. If Found, update to existing grp //else create this slot in database
                const { _id, grpchatid, invitedMembers } = openSlotToUpdate[0];
                let driverCap = null;
                const findDriverCap = openSlotToUpdate[0].invitedMembers.filter((el) => {
                    if (el.isDriving.exist === true) {
                        driverCap = el.isDriving.spareCapacity;
                        console.log("driverCap", driverCap);
                        return true;
                    }
                });
                const totalmembers_final = invitedMembers.length + 1; // (include the addition of this member)
                const update_Capacity = await updateCapacity(userIsDriver, totalmembers_final, driverCap);
                const updateData = {
                    username: ctxt.session.username,
                    isDriving: ctxt.session.isDriving,
                    timeInvited: Date.now(),
                    timeToExpire: timeNow3mins //+ 3mins
                    //Derived time to delete member invite if no news after 3mins
                };
                // console.log("updateCapacity(userIsDriver,totalmembers)", updateCapacity(userIsDriver.exist, totalmembers_final))
                const updateVacantCap = await inviteLinkDB_1.default.findByIdAndUpdate({ _id: _id }, { $set: { vacantCapacity: update_Capacity } });
                const updateMember = await inviteLinkDB_1.default.findByIdAndUpdate({ _id: _id }, { $addToSet: { invitedMembers: updateData } });
                console.log("updateMemberadded", updateMember);
                console.log("updateVacantCap", updateVacantCap);
            }
            else { //else create this slot in database
                console.log("totalCapacity(userIsDriver)", totalCapacity(userIsDriver));
                const addTimeslot = {
                    grpchatid: -705354562,
                    enterAL: enterAL,
                    locationToMeet: locationToMeet,
                    timeslot: { date: new Date(timeslot_), day: arrays_2.default[timeslot_.getDay()], timing: getRounded24HrsString(dateConvert(timeslot_)) },
                    invitedMembers: [
                        {
                            username: ctxt.session.username,
                            isDriving: ctxt.session.isDriving,
                            timeInvited: Date.now(),
                            timeToExpire: timeNow3mins //+ 3mins
                            //Derived time to delete member invite if no news after 3mins
                        }
                    ],
                    vacantCapacity: totalCapacity(userIsDriver),
                    invitelink: grplinks_1.default[0], //search for empty slot
                };
                const createdTimeslot = await inviteLinkDB_1.default.create(addTimeslot);
                console.log("created New entry to DB", createdTimeslot);
            }
        }
    }
    catch (error) {
        console.log("try error");
        console.log(error);
    }
};
exports.saveUserChoice = saveUserChoice;
// router.post("/", async (req, res) => {
//     try {
//       const createdListing = await User.create(req.body);
//       const lister = await User.findOne({ username: req.body.lister });
//       lister.listings.push(createdListing._id);
//       await lister.save();
//       res.status(200).send(createdListing);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });
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
// days: {
//   $filter: {
//     input: "$days", // le tableau à limiter 
//     as: "index", // un alias
//     cond: {$and: [
//       { $gte: [ "$$index.day", new Date("2020-12-29T00:00:00.000Z") ] },
//       { $lte: [ "$$index.day", new Date("2020-12-31T00:00:00.000Z") ] }
//     ]}
//   }
// }
