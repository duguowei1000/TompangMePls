import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    chatid: { type: Number},
    username: { type: String},
    enterAL: {type: Boolean},
    timeslot: { type: Date }, //, default: Date.now 
    locationToMeet: {type: String},
    counter:{type: Number}

});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;