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
const x_ = new Date(asd);
console.log('date', x_);
const y_ = new Date(zxc);
console.log('date', y_);
const z_ = new Date(qwe);
console.log('date', z_);
/////////////
const roundNearest30 = (num) => {
    return Math.round(num / 30) * 30;
};
const suggestSpecificTimeslot = (session) => {
    console.log("session", session);
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
        }];
    return array;
};
exports.suggestSpecificTimeslot = suggestSpecificTimeslot;
const suggestions = [{
        grpchatid: 427599753,
        enterAL: false,
        locationToMeet: "Jurong East",
        timeslot: { date: x_, day: "Thurs", timing: 1530 },
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
        locationToMeet: "Choa Chu Kang",
        //username: { type: String, unique: true, required: true },
        timeslot: { date: x_, day: "Wed", timing: 2030 },
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
        locationToMeet: "Jurong East",
        //username: { type: String, unique: true, required: true },
        timeslot: {
            date: y_,
            day: "Thurs",
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
        locationToMeet: "Choa Chu Kang",
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
