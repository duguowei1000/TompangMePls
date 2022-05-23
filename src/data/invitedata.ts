

const chats: [{
    chatid: 427599753,//[{ type: Number, unique: true }],
    enterAL: false,//{type: Boolean},
    locationToMeet: "Jurong East",//{type: String},
    //username: { type: String, unique: true, required: true },
    timeslot: { day: "Thurs", timing: "330pm" },//{ type: Date }, //, default: Date.now 
    invitedMembers: [
        { 
        username: "tuxedo",//{ type: String },
        isDriving: false,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        timeInvited: ""//{ type: Date },
        //Derived time to delete member invite if no news after 3mins
    },
    { 
        username: "Coke",//{ type: String },
        isDriving: false,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        timeInvited: ""//{ type: Date },
        //Derived time to delete member invite if no news after 3mins
    }],
    capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
},
{
    chatid: 327592353,//[{ type: Number, unique: true }],
    enterAL: true,//{type: Boolean},
    locationToMeet: "Choa Chu Kang",//{type: String},
    //username: { type: String, unique: true, required: true },
    timeslot: { day: "Tues", timing: "1230pm" },//{ type: Date }, //, default: Date.now 
    invitedMembers: [
        { 
        username: "sprite",//{ type: String },
        isDriving: true,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        timeInvited: ""//{ type: Date },
        //Derived time to delete member invite if no news after 3mins
    },{ 
        username: "honeylemon",//{ type: String },
        isDriving: false,//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
        timeInvited: ""//{ type: Date },
        //Derived time to delete member invite if no news after 3mins
    }

],
    capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
}
]

export default chats