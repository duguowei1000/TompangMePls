"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserChoice = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await User_1.default.deleteMany({});
        await User_1.default.create([
            {
                username: "mrdgw",
                chatid: 427599753,
                timeslot: 1652981050592,
                destination: ""
                // password: bcrypt.hashSync("12345", saltRounds),
            },
            {
                username: "spareGw",
                chatid: 5318610042,
                timeslot: 1652981050592,
                destination: ""
                // password: bcrypt.hashSync("12345", saltRounds),
            },
        ]);
        res.send("Users Seed");
    }
    catch (error) {
        console.log(error);
    }
});
const saveUserChoice = async (ctxt, time, destinationChoice) => {
    // console.log('chatusername',ctxt.chat.username)
    // console.log('destChoice',destinationChoice)
    console.log('timeChoice', time);
    try {
        const user = await User_1.default.find({ username: ctxt.chat.username });
        console.log("userdata", user[0]);
        const userName = user[0].username; //await User.findOne({ username: ctxt.chat.username });
        const userDestination = user[0].destination; //await User.findOne({ destination: destinationChoice });
        const time = user[0].timeslot; //await User.findOne({ timeslot: time });
        if (userDestination === destinationChoice) {
            console.log(userDestination);
        }
        console.log(`userName${userName} && userDest${userDestination} && time ${time}`);
        if (userName && userDestination) {
            await ctxt.reply(`You have already chosen a ${userDestination}, update your choice?`); //, { reply_markup: timeMenu });
            console.log(`You have already chosen a ${userDestination}, update your choice?`);
        }
        else {
            // console.log(ctxt.chat)
            ctxt.reply(`You chose ${time}`);
            console.log(`${ctxt.chat.username} chose Time >>> ${time}`); //scheduleDatabase[i].timeDisplay)
            const createdListing = await User_1.default.create({
                chatid: `${ctxt.chat.id}`,
                username: `${ctxt.chat.username}`,
                timeslot: Date.now(),
                destination: "Jurong East"
            });
            console.log("created New entry to DB", createdListing);
        }
    }
    catch (error) {
        console.log("error");
    }
    // await outputSuggestedMRT(ctxt)
};
exports.saveUserChoice = saveUserChoice;
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
