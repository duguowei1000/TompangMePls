import express from "express";
import User from "../models/User";
import InviteDB from "../models/inviteLinkDB";
const router = express.Router();
// const bcrypt = require("bcrypt");
import { Router } from "@grammyjs/router";
import { suggestSpecificTimeslot } from "../data/invitedata";

//test
const x_ = new Date("2022-05-29T03:00:00.000Z")
console.log('datex', x_-5400000)
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
  try {
    await InviteDB.deleteMany({})
    await InviteDB.create(
      [{
        grpchatid: 427599753,//[{ type: Number, unique: true }],
        enterAL: false,//{type: Boolean},
        locationToMeet: "JE Mrt",//{type: String},
        timeslot: { date: x_, day: "Fri", timing: 1530 },//{ type: Date }, //, default: Date.now 
        invitedMembers: [
            {
                username: "tuxedo",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: y_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            },
            {
                username: "Coke",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: z_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }],
        capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
        grpchatid: 327592353,//[{ type: Number, unique: true }],
        enterAL: true,//{type: Boolean},
        locationToMeet: "CCK Mrt",//{type: String},
        //username: { type: String, unique: true, required: true },
        timeslot: { date: x_, day: "Fri", timing: 2030 },//{ type: Date }, //, default: Date.now 
        invitedMembers: [
            {
                username: "sprite",//{ type: String },
                isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: y_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }, {
                username: "honeylemon",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: z_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }
    
        ],
        capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }

      ]


    );
    res.send("Users Seed")
  } catch (error) {
    console.log(error);
  }
})

//Criteria for suggestions : within 1.5 hrs of indicated time
const findSuggestions = async (session) => {

  // console.log("sessionFindsuggestions", session)
  const enterAL = session.enterAL
  const timeslot:any = new Date(session.timeslot.date) 
  timeslot.getTime()
  // console.log("getTimeFindsuggestions", timeslot)
  //const locationToMeet = session.locationToMeet
  const isDriving = session.isDriving //user is driver or not

  if(isDriving.exist){
    const slotAvailable_D: any = await InviteDB.find({ //all possible choices within the criterion
      $and: [
        {isDriving: { exist : false }},  //specifically looking for grps without driver
        { enterAL : enterAL },
        { timeslot:  { $in:[timeslot-5400000 ,timeslot+5400000 ]}},
      ]
    })

    return slotAvailable_D
  }else if (!isDriving.exist){
    const slotAvailable_ND: any = await InviteDB.find({ //all possible choices within the criterion
      $and: [
        { enterAL : enterAL },
        { timeslot:  { $in:[timeslot-5400000 ,timeslot+5400000 ]}},
      ]
    })
    return slotAvailable_ND

  }
  return 
    
}

//Driver should not see another driver
const findUserChoice = async (session) => {
  console.log("session", session)
  const enterAL = session.enterAL
  const timeslot: Date = session.timeslot
  const locationToMeet = session.locationToMeet
  const isDriving = session.isDriving //user is driver or not

  const suggestions = await findSuggestions(session)  //get from database relaxed criterion <timeslot within 90mins>
  console.log("suggestions",suggestions)
  if(isDriving.exist){
    const specificSlotAvailable_D: any = await InviteDB.findOne({
      $and: [
        {isDriving: { exist : false }},  //specifically looking for grps without driver
        { enterAL : enterAL },
        { timeslot: timeslot },
        { locationToMeet: { locationToMeet: locationToMeet } }
      ]
    })
    console.log("specificSlotAvailable",specificSlotAvailable_D)
    if (!specificSlotAvailable_D) // no rooms that match, need create for next step**
    {
      // console.log("suggested addtional",suggestSpecificTimeslot(session))
      const suggestUserSpecificSlot = suggestSpecificTimeslot(session)
      return [ ...suggestions,...suggestUserSpecificSlot]

    }
  }else if (!isDriving.exist){
    const specificSlotAvailable_ND: any = await InviteDB.findOne({
      $and: [
        { enterAL : enterAL },
        { timeslot: timeslot },
        { locationToMeet: { locationToMeet: locationToMeet } }
      ]
    })
    if (!specificSlotAvailable_ND) // no rooms that match, need create for next step**
    {
      console.log("suggested addtional",suggestSpecificTimeslot(session))
      const suggestUserSpecificSlot = suggestSpecificTimeslot(session)
      return [ ...suggestions,...suggestUserSpecificSlot]

    }

  }

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
export { saveUserChoice, findUserChoice , findSuggestions}



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