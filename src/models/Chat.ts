import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatid: { type: Number, unique: true },
    //username: { type: String, unique: true, required: true },
    timeslot: { type: Date }, //, default: Date.now 
    members: [{ type: String }],
    location: {type: String}
});

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
// module.exports = Chat;