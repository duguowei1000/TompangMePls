import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    chatid: { type: Number, unique: true },
    username: { type: String, unique: true, required: true },
    timeslot: { type: Date },
    destination: { type: String }
});
const User = mongoose.model("User", userSchema);
export default User;
