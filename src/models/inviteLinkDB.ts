import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    
    chats: [{
        chatids: [{ type: Number, unique: true }],
        enterAL: {type: Boolean},
        locationToMeet: {type: String},
        //username: { type: String, unique: true, required: true },
        timeslot: { type: Date }, //, default: Date.now 
        invitedMembers: [
            { 
            username: { type: String },
            isDriving:{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: { type: Date },
            //Derived time to delete member invite if no news after 3mins
        }],
        capacity: {type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }
    ]

});

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
// module.exports = Chat;