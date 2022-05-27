"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestSpecificTimeslot = exports.suggestions = void 0;
const trialDate = new Date;
trialDate.getDate();
console.log(trialDate);
const mili = new Date(trialDate); //new Date("Thu May 26 2022 23:35:39")
// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
console.log("moonlanding", mili.getTime());
const qwe = mili.setDate(mili.getDate() - 5);
const asd = mili.setDate(mili.getDate() + 4);
const zxc = mili.setDate(mili.getDate() + 8);
// const y
const x_ = new Date("2022-05-29T03:00:00.000Z");
console.log('datex', x_ - 1000000);
const xcv = x_ - 5400000;
console.log('datexcv', xcv);
const bnm = new Date(xcv);
console.log('datebnm', bnm);
const y_ = new Date(zxc);
console.log('datey', y_);
const z_ = new Date(qwe);
console.log('datez', z_);
/////////////
function roundToNearest30(date = new Date()) {
    const minutes = 30;
    const ms = 1000 * 60 * minutes;
    // 👇️ replace Math.round with Math.ceil to always round UP
    return new Date(Math.round(date.getTime() / ms) * ms);
}
const suggestSpecificTimeslot = (session) => {
    console.log("session", session);
    const rounded = roundToNearest30(session.timeslot.date);
    const getHours = String(rounded.getHours());
    const getMins = String(rounded.getMinutes());
    const adjustMins = () => {
        if (getMins === "0") {
            return "00";
        }
        else {
            return getMins;
        }
    };
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
                timing: getHours.concat(adjustMins()) //string
            }
        },
        {
            enterAL: session.enterAL,
            locationToMeet: "CCK Mrt",
            timeslot: {
                date: rounded,
                day: session.timeslot.day,
                timing: getHours.concat(adjustMins()) //string
            }
        }];
    return array;
};
exports.suggestSpecificTimeslot = suggestSpecificTimeslot;
const suggestions = [{
        grpchatid: 427599753,
        enterAL: false,
        locationToMeet: "JE Mrt",
        timeslot: { date: x_, day: "Fri", timing: 1530 },
        invitedMembers: [
            {
                username: "tuxedo",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: y_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            },
            {
                username: "Coke",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: z_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }
        ],
        capacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
        grpchatid: 327592353,
        enterAL: true,
        locationToMeet: "CCK Mrt",
        //username: { type: String, unique: true, required: true },
        timeslot: { date: x_, day: "Fri", timing: 2030 },
        invitedMembers: [
            {
                username: "sprite",
                isDriving: { exist: true, spareCapacity: 3 },
                timeInvited: y_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }, {
                username: "honeylemon",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: z_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }
        ],
        capacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }
];
exports.suggestions = suggestions;
const chats = [
    {
        chatid: 427599753,
        enterAL: false,
        locationToMeet: "JE mrt",
        //username: { type: String, unique: true, required: true },
        timeslot: {
            date: y_,
            day: "Fri",
            timing: "1530"
        },
        invitedMembers: [
            {
                username: "tuxedo",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: z_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            },
            {
                username: "Coke",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: x_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }
        ],
        capacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    },
    {
        chatid: 327592353,
        enterAL: true,
        locationToMeet: "CCK Mrt",
        //username: { type: String, unique: true, required: true },
        timeslot: { date: x_, day: "Tues", timing: "1230pm" },
        invitedMembers: [
            {
                username: "sprite",
                isDriving: { exist: true, spareCapacity: 3 },
                timeInvited: y_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }, {
                username: "honeylemon",
                isDriving: { exist: false, spareCapacity: null },
                timeInvited: x_ //{ type: Date },
                //Derived time to delete member invite if no news after 3mins
            }
        ],
        capacity: 4 //{type: Number} //total capacity = Driver + spareCapacity //OR carpool (4pax)
    }
];
exports.default = chats;
