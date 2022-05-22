import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    chatid: { type: Number, unique: true},
    username: { type: String, unique: true, required: true},
    enterAL: {type: Boolean},
    timeslot: { type: Date }, //, default: Date.now 
    locationToMeet: {type: String}
});

const User = mongoose.model("User", userSchema);

export default User;