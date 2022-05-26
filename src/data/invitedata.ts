

const trialDate = new Date
trialDate.getDate()
console.log(trialDate)

const mili = new Date(trialDate); //new Date("Thu May 26 2022 23:35:39")

// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
console.log("moonlanding", mili.getTime());
const qwe = mili.setDate(mili.getDate() - 5)
const asd = mili.setDate(mili.getDate() + 4)
const zxc = mili.setDate(mili.getDate() + 8)
// const y
const x_ = new Date(asd)
console.log('date', x_)
const y_ = new Date(zxc)
console.log('date', y_)
const z_ = new Date(qwe)
console.log('date', z_)

import InviteDB from "../models/inviteLinkDB";
/////////////

const roundNearest30 = (num:number) => {
    return Math.round(num / 30) * 30;
  }
const suggestSpecificTimeslot = (session) => {
    console.log("session",session)
    const array = [{
        enterAL: session.enterAL,
        locationToMeet: "Jurong East",
        timeslot: {
            date: session.timeslot.date,
            day: session.timeslot.day,
            timing: roundNearest30(session.timeslot.timing)
        }
    },
    {
        enterAL: session.enterAL,
        locationToMeet: "Choa Chu Kang",
        timeslot: {
            date: session.timeslot.date,
            day: session.timeslot.day,
            timing: roundNearest30(session.timeslot.timing)
        }
    }]
    return array
}



const suggestions = [{
    grpchatid: 427599753,//[{ type: Number, unique: true }],
    enterAL: false,//{type: Boolean},
    locationToMeet: "Jurong East",//{type: String},
    timeslot: { date: x_, day: "Thurs", timing: 1530 },//{ type: Date }, //, default: Date.now 
    invitedMembers: [
        {
            username: "tuxedo",//{ type: String },
            isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: y_//{ type: Date },
            //Derived time to delete member invite if no news after 3mins
        },
        {
            username: "Coke",//{ type: String },
            isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: z_//{ type: Date },
            //Derived time to delete member invite if no news after 3mins
        }],
    capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
},
{
    grpchatid: 327592353,//[{ type: Number, unique: true }],
    enterAL: true,//{type: Boolean},
    locationToMeet: "Choa Chu Kang",//{type: String},
    //username: { type: String, unique: true, required: true },
    timeslot: { date: x_, day: "Wed", timing: 2030 },//{ type: Date }, //, default: Date.now 
    invitedMembers: [
        {
            username: "sprite",//{ type: String },
            isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: y_//{ type: Date },
            //Derived time to delete member invite if no news after 3mins
        }, {
            username: "honeylemon",//{ type: String },
            isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
            timeInvited: z_//{ type: Date },
            //Derived time to delete member invite if no news after 3mins
        }

    ],
    capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
}
]

const chats = [
    {
        chatid: 427599753,//[{ type: Number, unique: true }],
        enterAL: false,//{type: Boolean},
        locationToMeet: "Jurong East",//{type: String},
        //username: { type: String, unique: true, required: true },
        timeslot: {
            date: y_,
            day: "Thurs",
            timing: "1530"
        },//{ type: Date }, //, default: Date.now 
        invitedMembers: [
            {
                username: "tuxedo",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: z_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            },
            {
                username: "Coke",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: x_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }],
        capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
        chatid: 327592353,//[{ type: Number, unique: true }],
        enterAL: true,//{type: Boolean},
        locationToMeet: "Choa Chu Kang",//{type: String},
        //username: { type: String, unique: true, required: true },
        timeslot: { date: x_, day: "Tues", timing: "1230pm" },//{ type: Date }, //, default: Date.now 
        invitedMembers: [
            {
                username: "sprite",//{ type: String },
                isDriving: { exist: true, spareCapacity: 3 },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: y_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }, {
                username: "honeylemon",//{ type: String },
                isDriving: { exist: false, spareCapacity: null },//{ exist: {type: Boolean} , spareCapacity:{ type: Number } },
                timeInvited: x_//{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }

        ],
        capacity: 4//{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }
]


export default chats
export { suggestions, suggestSpecificTimeslot }
