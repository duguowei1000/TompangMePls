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
console.log("hours", date.getHours());
console.log("mins", date.getMinutes());
// console.log(x.getDay())
console.log(Date.now());
console.log("thisdate", date.getDate());
date.setDate(date.getDate() + 8); //date in integer
console.log("thisdate", date.getDate());
// Note that the JavaScript's Date object tracks time in UTC internally, but most of its methods (except the ones with UTC in their name) return output in the local time of the visitor (the time zone the visitor's computer is in).
