import express from "express";
import User from "../models/User";
import InviteDB from "../models/inviteLinkDB";
const router = express.Router();
// const bcrypt = require("bcrypt");
import { Router } from "@grammyjs/router";
import { suggestSpecificTimeslot } from "../data/invitedata";
import roundToNearest30 from "../data/timeFunctions";


const dateConvert = (ms) => {
  return new Date(ms)
}
const getRounded24HrsString = (date) => {  //date
  const rounded = roundToNearest30(date)
  const getHours = String(rounded.getHours())
  const getMins = String(rounded.getMinutes())
  const adjustMins = () => {
    if (getMins === "0") { return "00" } else { return getMins }
  }
  return getHours.concat(adjustMins())
}
///INPUT time to test for database
const x_ = new Date("2022-05-30T14:00:00.000Z")
console.log('datex', x_ - 1000000)
const xcv = x_ - 5400000
const qwe = x_ - 5000000
const zxc = x_ - 4000000

const y_ = x_ - 300000
console.log('datey', y_)
const z_ = x_ + 6000000
console.log('datez', z_)
// const saltRounds = 10;
router.get("/seed", async (req, res) => {

  const existingChats = [
    {
      grpchatid: 427599753,//[{ type: Number, unique: true }],
      enterAL: false,//{type: Boolean},
      locationToMeet: "JE mrt",//{type: String},
      //username: { type: String, unique: true, required: true },
      timeslot: {
        date: x_ - 2000000,
        day: "Mon",
        timing: getRounded24HrsString(dateConvert(x_ - 2000000))
      },//{ type: Date }, //, default: Date.now 
      invitedMembers: [
        {
          username: "tuxedo",//{ type: String },
          isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: z_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        },
        {
          username: "Coke",//{ type: String },
          isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: x_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        }],
      vacantCapacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
      grpchatid: 527599753,//[{ type: Number, unique: true }],
      enterAL: false,//{type: Boolean},
      locationToMeet: "CCK mrt",//{type: String},
      //username: { type: String, unique: true, required: true },
      timeslot: {
        date: x_ - 1000000,
        day: "Mon",
        timing: getRounded24HrsString(dateConvert(x_ - 1000000))
      },//{ type: Date }, //, default: Date.now 
      invitedMembers: [
        {
          username: "sketches",//{ type: String },
          isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: z_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        },
        {
          username: "berry",//{ type: String },
          isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: x_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        }],
      vacantCapacity: 2//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
      grpchatid: 327592353,//[{ type: Number, unique: true }],
      enterAL: true,//{type: Boolean},
      locationToMeet: "CCK Mrt",//{type: String},
      //username: { type: String, unique: true, required: true },
      timeslot: { date: x_, day: "Tues", timing: "1230pm" },//{ type: Date }, //, default: Date.now 
      invitedMembers: [
        {
          username: "sprite",//{ type: String },
          isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: y_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        }, {
          username: "honeylemon",//{ type: String },
          isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
          timeInvited: x_//{ type: Date },
          //Derived time to delete member invite if no news after 3mins
        }

      ],
      vacantCapacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }

  ];
  await InviteDB.deleteMany({});
  await InviteDB.insertMany(existingChats);
  res.json(existingChats);
})

//Criteria for suggestions : within 1.5 hrs of indicated time
const findLaxSuggestions = async (session) => {
  const enterAL = session.enterAL
  const timeslotinDate: any = new Date(session.timeslot.date)
  timeslotinDate.getTime()
  console.log("getTimeFindsuggestionsfromtimeslot", timeslotinDate)
  //const locationToMeet = session.locationToMeet
  const isDriving = session.isDriving //user is driver or not

  const checkTime = (ms: number) => { return (timeslotinDate.getTime() - 5400000) && ms < (timeslotinDate.getTime() + 5400000) }

  const filteredTimeArray = []
  const finalFiltered: any = []

  if (isDriving.exist) {
    const slotAvailable_D_EL: any = await InviteDB.find({ //all possible choices within the criterion
      $and: [
        { enterAL: enterAL },
        { vacantCapacity: { $gt: 0 } }]
    })

    //filter time
    for (const obj of slotAvailable_D_EL) {
      // console.log("timeslotinDate",timeslotinDate)
      // console.log("timeslotinDate-5400000",timeslotinDate-5400000)
      // console.log("obj boolean",(checkTime(obj.timeslot.date)))
      // console.log("obj.timeslot.date.Gettime",(obj.timeslot.date.getTime()))
      if (checkTime(obj.timeslot.date.getTime())) {
        filteredTimeArray.push(obj)
      }
    }
    //filter driver
    for (const obj2 of filteredTimeArray) {        //grps with no driver
      if (obj2.invitedMembers.every((drive) => drive.isDriving.exist === false)) {
        finalFiltered.push(obj2)
      }
    }
    console.log("finalFiltered", finalFiltered)
    return finalFiltered

  } else if (!isDriving.exist) {
    const slotAvailable_ND: any = await InviteDB.find({ //all possible choices within the criterion
      $and: [
        { enterAL: enterAL },
        { vacantCapacity: { $gt: 0 } }
      ]
    })
    //filter time
    for (const obj of slotAvailable_ND) {
      if (checkTime(obj.timeslot.date.getTime())) {
        finalFiltered.push(obj)
      }
    }
    console.log("finalFilterednodriverHere", finalFiltered)
    return finalFiltered

  }
}

//If no timeslot match the derived timeslot
const suggestSpecificTimeslot = (session) => {
  const rounded = roundToNearest30(session.timeslot.date)
  const array = [{
    enterAL: session.enterAL,
    locationToMeet: "JE Mrt",
    timeslot: {
      date: rounded,              //Date format
      day: session.timeslot.day, //string
      timing: getRounded24HrsString(session.timeslot.date) //string
    }
  },
  {
    enterAL: session.enterAL,
    locationToMeet: "CCK Mrt",
    timeslot: {
      date: rounded,                  //Date format
      day: session.timeslot.day,      //string
      timing: getRounded24HrsString(session.timeslot.date) //string
    }
  }]
  return array
}

//Driver should not see another driver
const findUserChoice = async (session) => {
  // const enterAL = session.enterAL
  // const locationToMeet = session.locationToMeet
  // const isDriving = session.isDriving //user is driver or not
  const timeslot: Date = session.timeslot.date
  const derivedTime = roundToNearest30(timeslot)
  console.log("derivedTime", derivedTime)
  console.log("derivedTimegetTime", derivedTime.getTime())

  const laxSuggestions = await findLaxSuggestions(session)  //Specifically timeslots existing in database relaxed criterion <timeslot within 90mins>
  console.log("suggestions", laxSuggestions)

  /////CREATE TIMESLOT IF NO EXACT TIMESLOT FOUND IN DATABASE
  const finalSuggestion = async () => {
    const checkExactTimeExist = laxSuggestions.some((ti) => { return ((ti.timeslot.date.getTime() === derivedTime.getTime())) })
    console.log("checkExactTimeExist", checkExactTimeExist)
    if (!checkExactTimeExist) {
      return [...laxSuggestions, ...suggestSpecificTimeslot(session)]

    } else return laxSuggestions
  }
  const completeSuggestions: any = await finalSuggestion()
  return completeSuggestions

}

const saveUserChoice = async (ctxt, selectedSlot) => {
  const enterAL = selectedSlot.enterAL
  const timeslot: Date = selectedSlot.timeslot
  const locationToMeet = selectedSlot.locationToMeet
  const isDriving = selectedSlot.isDriving
  console.log('selectedSlot', selectedSlot)

  try {
    const user = await InviteDB.find({ invitedMembers: [{ username: ctxt.chat.username }] });
    const specificSlot: any = await InviteDB.find({
      $and: [
        { timeslot: { date: date } },
        { locationToMeet: { locationToMeet: locationToMeet } }
      ]
    })
    const userName = user[0].username//await User.findOne({ username: ctxt.chat.username });
    const userlocationToMeet = user[0].locationToMeet//await User.findOne({ destination: destinationChoice });
    const time = user[0].timeslot//await User.findOne({ timeslot: time });
    // if(userlocationToMeet === destinationChoice){ return console.log(userDestination)}
    // console.log(`userName${userName} && userDest${userDestination} && time ${time}` )
    // if (userName && userDestination){
    //   await ctxt.reply(`You have already chosen a ${userDestination}, update your choice?`)//, { reply_markup: timeMenu });
    //   console.log(`You have already chosen a ${userDestination}, update your choice?`) ;
    // } 

    console.log("userdata", user)
    console.log("userdata", specificSlot)

    if (userName) {   ///should not happen
      console.log(`userName${userName} && userDest${userlocationToMeet} && time ${time} , please press /start to update`)
      ctxt.reply(`You already chose ${time} && userDest${userlocationToMeet} , please press /start to update`)
    } else if (!specificSlot) {         //create that specific timeslot for the user if no existing
      const totalCapacity = () => {
        if (isDriving.exist) return isDriving.spareCapacity
        else return 4
      }//OR carpool (4pax)

      const addMemberToTimeslot = {
        grpchatid: `grpchatid from chats`,//[{ type: Number, unique: true }],
        enterAL: enterAL,//{type: Boolean},
        locationToMeet: locationToMeet,//{type: String},
        timeslot: timeslot,//{ type: Date }, //, default: Date.now 
        invitedMembers: [
          {
            username: `${ctxt.chat.username}`,//{ type: String },
            isDriving: false,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: Date.now(),//{ type: Date },
            timeToExpire: Date.now() //+ 3mins
            //Derived time to delete member invite if no news after 3mins
          }],
        capacity: totalCapacity()//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
      }

      const createdTimeslot = await InviteDB.create(addMemberToTimeslot);
      console.log("created New entry to DB", createdTimeslot)
    }

  } catch (error) {
    console.log("try error")
  }


}

// await outputSuggestedMRT(ctxt)

router.post("/", async (req, res) => {
  // console.log("req.body", req.body);
  try {
    const createdListing = await User.create(req.body);
    const lister = await User.findOne({ username: req.body.lister });

    lister.listings.push(createdListing._id);
    await lister.save();

    res.status(200).send(createdListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router
export { saveUserChoice, findUserChoice, getRounded24HrsString, findSuggestions }



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