import express from "express";
import User from "../models/User";
import InviteDB from "../models/inviteLinkDB";
const router = express.Router();
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();


const mongoURI = String(process.env.MONGO_URI);
console.log(mongoURI)
mongoose.connect(mongoURI, {}, () => {
    console.log("connected to mongodb");
});


const findSuggestions = async () => {
    console.log("here")

    try {
const slotAvailable_D: any = await InviteDB.find({ //all possible choices within the criterion
    //$and: [
    //   invitedMembers: { $elemMatch: { isDriving: { exist :{$eq: false}}   } }
      // {invitedMembers: isDriving: { exist : false }},  //specifically looking for grps without driver
    //   grpchatid:{$eq: 327592353}
      enterAL :  true
      //{ timeslot:  {date: { $in:[timeslotinDate-5400000 ,timeslotinDate+5400000 ]} }},
    //]
  })

  console.log(slotAvailable_D)
}catch (error) {
    console.log(error)}}
findSuggestions()