import express from "express";
import User from "../models/User";
const router = express.Router();
// const bcrypt = require("bcrypt");

// const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await User.deleteMany({})
        await User.create([
          {
            username: "mrdgw",
            chatid: 427599753,
            timeslot: 1652981050592, //, default: Date.now 
            destination: ""
            // password: bcrypt.hashSync("12345", saltRounds),
          },
          {
            username: "spareGw",
            chatid: 5318610042,
            timeslot: 1652981050592, //, default: Date.now 
            destination: ""
            // password: bcrypt.hashSync("12345", saltRounds),
          },
        ]);
        res.send("Users Seed")
      } catch (error) {
          console.log(error);
      }
})

const saveUserChoice = async (ctxt, i: number) => {
  console.log(ctxt.chat)
  console.log(`${ctxt.chat.username} chose Time >>>`, scheduleDatabase[i].timeDisplay)

  await outputSuggestedMRT(ctxt)
}

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


export default router;



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