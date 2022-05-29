import mongoose from "mongoose";

const InviteDBSchema = new mongoose.Schema({
    
 
        grpchatid: { type: Number},
        
        enterAL: {type: Boolean},
        locationToMeet: {type: String},
        //username: { type: String, unique: true, required: true },
        timeslot:{date: { type: Date} ,day: { type: String }, timing: {type: String} } , //, default: Date.now { date: null,  day: null, timing: null },
        invitedMembers: [
            { 
            username: { type: String },
            isDriving:{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: { type: Date },
            timeToExpire: { type: Date },
            //Derived time to delete member invite if no news after 3mins
        }],
        vacantCapacity: {type: Number}, //vacantCapacity = Driver + spareCapacity //OR carpool (4pax)
        invitelink: {type: String},
    }

);

const InviteDB = mongoose.model("InviteDB", InviteDBSchema);

export default InviteDB;
// module.exports = Chat;