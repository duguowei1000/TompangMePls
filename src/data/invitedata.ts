

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
  function roundToNearest30(date = new Date()) {
    const minutes = 30;
    const ms = 1000 * 60 * minutes;
  
    // 👇️ replace Math.round with Math.ceil to always round UP
    return new Date(Math.round(date.getTime() / ms) * ms);
  }
const suggestSpecificTimeslot = (session) => {
    console.log("session",session)
    const rounded = roundToNearest30(session.timeslot.date)
    const getHours= String(rounded.getHours())
    const getMins= String(rounded.getMinutes())
    const adjustMins = () => {
        if (getMins ==="0") {return "00"}else {return getMins} 
    }
    // console.log(">>>>rounded",rounded )
    // console.log(">>>>getHours",getHours )
    // console.log(">>>>getMins",getMins )
    // console.log(">>>>hoursmins",getHours.concat(adjustMins()) )
    const array = [{
        enterAL: session.enterAL,
        locationToMeet: "JE Mrt",
        timeslot: {
            date: rounded,
            day: session.timeslot.day,
            timing: getHours.concat(adjustMins())
        }
    },
    {
        enterAL: session.enterAL,
        locationToMeet: "CCK Mrt",
        timeslot: {
            date: rounded,
            day: session.timeslot.day,
            timing: getHours.concat(adjustMins())
        }
    }]
    return array
}



const suggestions = [{
    grpchatid: 427599753,//[{ type: Number, unique: true }],
    enterAL: false,//{type: Boolean},
    locationToMeet: "JE Mrt",//{type: String},
    timeslot: { date: x_, day: "Fri", timing: 1530 },//{ type: Date }, //, default: Date.now 
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
    locationToMeet: "CCK Mrt",//{type: String},
    //username: { type: String, unique: true, required: true },
    timeslot: { date: x_, day: "Fri", timing: 2030 },//{ type: Date }, //, default: Date.now 
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
        locationToMeet: "JE mrt",//{type: String},
        //username: { type: String, unique: true, required: true },
        timeslot: {
            date: y_,
            day: "Fri",
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
        locationToMeet: "CCK Mrt",//{type: String},
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
