"use strict";
const date = new Date();
// date.setDate(date.getDate() + 1);
// console.log(date.getTimezoneOffset())
// date.setDate(date.getDate() + 7);
console.log(date);
// const x = date.setHours(date.getDate() + 8);
// date.setHours(date.getHours() + 10);  //adds hours
// console.log(x)
console.log("day", date.getDay());
const now_ = new Date;
now_.setDate(now_.getDate() + 1); //next date alr
now_.getDay(); //next date alr
console.log("now_", now_);
console.log("now_", now_.getDay());
console.log("hours", date.getHours());
console.log("mins", date.getMinutes());
console.log("getTime", date.getTime());
// console.log(x.getDay())
console.log(Date.now());
console.log("thisdate", date.getDate());
date.setDate(date.getDate() + 8); //date in integer
console.log("thisdate", date.getDate());
// Note that the JavaScript's Date object tracks time in UTC internally, but most of its methods (except the ones with UTC in their name) return output in the local time of the visitor (the time zone the visitor's computer is in).
const trialDate = new Date;
trialDate.getDate();
console.log(trialDate);
const mili = new Date(trialDate); //new Date("Thu May 26 2022 23:35:39")
// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
console.log("moonlanding", mili.getTime());
mili.getDay();
console.log('date', mili.getDay());
// const roundNearest30 = (num:string) => {
//     let first2Str = String(num).slice(0,2)
//     console.log("first2str",first2Str)
//     const last2Str = String(num).slice(-2)
//     const last2Num = Math.round(Number(last2Str) / 30) * 30 
//     if (last2Num === 60) {
//         const tostring =last2Num.toString()
//         tostring === "00"
//         first2StrN = Number(first2Str)
//     } else (
//         last2NumR = String(last2Num))
//      const final = first2Str.concat(last2NumR)
//      if (final ==="2360"){ return "0000"}else return final
// }
//  console.log(roundNearest30("1345")) 
// function roundToNearest30(date = new Date()) {
//     const minutes = 30;
//     const ms = 1000 * 60 * minutes;
//     // 👇️ replace Math.round with Math.ceil to always round UP
//     return new Date(Math.round(date.getTime() / ms) * ms);
//   }
//   console.log(roundToNearest30(new Date(2022, 1, 24, 6, 15)));
////REGEX 3 digits
//   console.log("timewrote",timeWrote)
const digits = "122";
const re = new RegExp('^[0-9]{3}$');
if (digits.match(re)) {
    const added = "0".concat(digits);
    console.log(added);
}
///////////////// 1.5hrs
// const x_ = new Date("2022-05-29T03:00:00.000Z")
// console.log('datex', x_-1000000)
// const xcv = x_-5400000
// console.log('datexcv', xcv)
// const bnm = new Date(xcv)
// console.log('datebnm',bnm)
// const y_ = new Date(zxc)
// console.log('datey', y_)
// const z_ = new Date(qwe)
// console.log('datez', z_)
