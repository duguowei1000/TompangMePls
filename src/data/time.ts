const scheduleDatabase = [

    { time: 600, timeDisplay: "0600" },
    { time: 630, timeDisplay: "0630" },
    { time: 700, timeDisplay: "0700" },
    { time: 730, timeDisplay: "0730" },
    { time: 800, timeDisplay: "0800" },
    { time: 830, timeDisplay: "0830" },
    { time: 900, timeDisplay: "0900" },
    { time: 930, timeDisplay: "0930" },
    { time: 1000, timeDisplay: "1000" },
    { time: 1030, timeDisplay: "1030" },
    { time: 1100, timeDisplay: "1100" },
    { time: 1230, timeDisplay: "1230" },
    { time: 1300, timeDisplay: "1300" },
    { time: 1330, timeDisplay: "1330" },
    { time: 1400, timeDisplay: "1400" },
    { time: 1530, timeDisplay: "1530" },
    { time: 1600, timeDisplay: "1600" },
    { time: 1630, timeDisplay: "1630" },
    { time: 1700, timeDisplay: "1700" },
    { time: 1730, timeDisplay: "1730" },
];

const firstTiming = "6am"

const lastTiming = "10pm"

const timeStr = '05:00 PM';
const secondTimeStr = '1142 Pm';
const thirdTimeStr = '03:00 aM';
const fourthTimeStr = '1342 am';

const convertTime = timeStr => {
   const [time, modifier] = timeStr.split(' ');
   let [hours, minutes] = time.split(':');
   if (hours === '12') {
      hours = '00';
   }
   if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
   }
   return `${hours}:${minutes}`;
};
console.log(convertTime(timeStr));
console.log(convertTime(secondTimeStr));
console.log(convertTime(thirdTimeStr));
console.log(convertTime(fourthTimeStr));


export default scheduleDatabase
export {}