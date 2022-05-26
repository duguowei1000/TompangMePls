import mongoose from "mongoose";

const InviteDBSchema = new mongoose.Schema({
    
    chats: [{
        grpchatid: [{ type: Number, unique: true }],
        enterAL: {type: Boolean},
        locationToMeet: {type: String},
        //username: { type: String, unique: true, required: true },
        timeslot:{date: { type: Date} ,day: { type: String }, timing: {type: Number} } , //, default: Date.now { date: null,  day: null, timing: null },
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

const InviteDB = mongoose.model("InviteDB", InviteDBSchema);

export default InviteDB;
// module.exports = Chat;