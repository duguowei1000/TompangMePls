"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
const router_1 = require("@grammyjs/router");
const UsersController_1 = require("./controllers/UsersController");
const dish_1 = require("./dish");
const arrays_1 = __importStar(require("./data/arrays"));
const Chat_1 = __importDefault(require("./models/Chat"));
const counter_1 = __importDefault(require("./models/counter"));
//////BOT
console.log(">>> in bot.ts >>>", process.env.BOT_TOKEN);
if (process.env.BOT_TOKEN == null)
    throw Error("BOT_TOKEN is missing.");
const bot = new grammy_1.Bot(`${process.env.BOT_TOKEN}`);
bot.use((0, grammy_1.session)({
    initial() {
        return {
            step: "idle",
            chatid: null,
            username: "",
            enterAL: undefined,
            isDriving: { exist: undefined, spareCapacity: null },
            timeslot: { date: null, day: null, timing: null },
            locationToMeet: "",
            suggestionTimeslots: undefined,
        };
    },
}));
const initiallise = {
    step: "idle",
    chatid: null,
    username: "",
    enterAL: undefined,
    isDriving: { exist: undefined, spareCapacity: null },
    timeslot: { date: null, day: null, timing: null },
    locationToMeet: "",
    suggestionTimeslots: undefined,
};
/////////////FUNCTION for saving username and choice of time///////////
// const outputSuggestedMRT = async (ctxt) => {
//     await ctxt.reply("please wait while we find a driver..")
//     // await ctxt.reply(
//     //     ctxt.id,
//     //     "*Hi\\!* _Welcome_ to [grammY](https://grammy.dev)\\.",
//     //     // { parse_mode: "MarkdownV2" },
//     //   );
// }
////////////////OUTPUT MENU///////////
////DYNAMIC MENU\\\\
// .url("About", "https://grammy.dev/plugins/menu").row()
const slotChosenText = () => `Are you a <b>Passenger</b> or <b>Driver</b>? `;
const slotchosen_menu = new menu_1.Menu("slotchosen_menu")
    // .submenu(
    //     "Going to Animal Lodge",
    //     "userDriver_menu", // navigation target menu
    //     (ctx) => {
    //         ctx.editMessageText(slotChosenText(), { parse_mode: "HTML" })
    //         ctx.session = {
    //             step: "idle",
    //             chatid: null,
    //             username: "",
    //             enterAL: true,
    //             isDriving: { exist: undefined, spareCapacity: null },
    //             timeslot: { day: null, timing: null },
    //             locationToMeet: "",
    //             suggestionTimeslots: undefined,
    //         }
    //     } // handler
    // ).row()
    .url("Login", "https://generalassemb.ly/").row();
const calculateMenu = new menu_1.Menu("calculateMenu");
calculateMenu
    .dynamic((ctx) => {
    const range = new menu_1.MenuRange();
    const suggestOutput = ctx.session.suggestionTimeslots;
    for (let i = 0; i < suggestOutput.length; i++) {
        const gotDriver = (i) => {
            const checkDriver = suggestOutput[i]?.invitedMembers; //optional chaining for specific timeslots
            if (checkDriver === undefined)
                return "No Driver";
            if (checkDriver.some((el) => {
                return (el.isDriving.exist === true);
            })) {
                return "Incl. Driver";
            }
            else
                return "No Driver";
        };
        if (!suggestOutput[i].enterAL) { //Output for leaving AL
            range.text(`${suggestOutput[i].timeslot.day} ${suggestOutput[i].timeslot.timing} drop@${suggestOutput[i].locationToMeet} (${suggestOutput[i].invitedMembers?.length ?? 0}pax ${gotDriver(i)})`, async (ctx) => {
                const { toSave, saved, data } = await (0, UsersController_1.saveUserChoice)(ctx, suggestOutput[i]); //+ reply message
                if (toSave === false) {
                    console.log("saved-1", saved);
                    console.log("data-1", data);
                    await ctx.reply(`Sorry <b>${ctx.session.username}</b>!\nYou have already chosen the timeslot @  <b>${data.timeDate} ${arrays_1.monthsArray[data.timeMth]}${arrays_1.default[data.timeDay]} ${data.timeTiming}hrs </b> with this invite link ${data.inviteLink},\nplease press /delete to update`, { parse_mode: "HTML" });
                }
                else {
                    console.log("saved.timeslot.date.getDate()", saved.timeslot.date.getDate());
                    await ctx.editMessageText(`You have chosen:\n<b>${saved.timeslot.date.getDate()} ${arrays_1.monthsArray[saved.timeslot.date.getMonth()]} ${arrays_1.default[saved.timeslot.date.getDay()]} ${saved.timeslot.timing}hrs </b> to leave Animal Lodge and drop off at ${saved.locationToMeet}.\n Please join the group via ${saved.invitelink} in 3 mins else your slot will be opened up for others.\n Kindly coordinate with your fellow car poolers or Driver on where to gather. If there is no driver, you can consider Grab or Taxi to destination. Dont be late :) `, { reply_markup: slotchosen_menu, parse_mode: "HTML" });
                }
            }).row(); //output invitelink
        }
        else if (suggestOutput[i].enterAL) {
            range.text(//Output for entering AL
            `${suggestOutput[i].timeslot.day} ${suggestOutput[i].timeslot.timing} @ ${suggestOutput[i].locationToMeet} (${suggestOutput[i].invitedMembers?.length ?? 0}pax ${gotDriver(i)})`, async (ctx) => {
                const { toSave, saved, data } = await (0, UsersController_1.saveUserChoice)(ctx, suggestOutput[i]); //+ reply message
                if (toSave === false) {
                    console.log("saved-2", saved);
                    console.log("data-2", data);
                    await ctx.reply(`Sorry <b>${ctx.session.username}</b>!\nYou have already chosen the timeslot @ <b>${data.timeDate} ${arrays_1.monthsArray[data.timeMth]}${arrays_1.default[data.timeDay]} ${data.timeTiming}hrs </b> with this invite link ${data.inviteLink},\nplease press /delete to update`, { parse_mode: "HTML" });
                }
                else {
                    console.log("saved.timeslot.date.getDate()", saved.timeslot.date.getDate());
                    await ctx.editMessageText(`You have chosen:\n<b>${saved.timeslot.date.getDate()} ${arrays_1.monthsArray[saved.timeslot.date.getMonth()]} ${arrays_1.default[saved.timeslot.date.getDay()]} ${saved.timeslot.timing}hrs </b> to leave Animal Lodge and drop off at ${saved.locationToMeet}.\n Please join the group via ${saved.invitelink} in 3 mins else your slot will be opened up for others.\n Kindly coordinate with your fellow car poolers or Driver on where to gather. If there is no driver, you can consider Grab or Taxi to destination. Dont be late :) `, { reply_markup: slotchosen_menu, parse_mode: "HTML" });
                }
            }).row(); //output invitelink
        }
    }
    return range;
})
    .text("Go Back", (ctx) => {
    ctx.session.timeslot = { date: null, day: null, timing: null };
    ctx.session.step = "day";
    ctx.menu.nav("days_menu");
    ctx.editMessageText(dayText(ctx.session.enterAL), { parse_mode: "HTML" }); //`Out of range, please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm.)`, { parse_mode: "HTML" })
});
// Use router
const stepRouter = new router_1.Router((ctx) => ctx.session.step);
// Define step that handles the time.
stepRouter.route("time", async (ctx) => {
    const timeWrote = parseInt(ctx.msg?.text ?? "", 10);
    console.log("timewrote", timeWrote);
    if (isNaN(timeWrote)) {
        await ctx.reply("That is not a valid day, try again!");
        return;
    }
    else if (timeWrote < 600 || 2200 < timeWrote) {
        await ctx.reply(`Out of range, please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm`, { parse_mode: "HTML" });
        return;
    }
    const convertHrsMins = (timestring) => {
        const wroteMins = String(timestring).slice(-2);
        const wroteHrs = String(timestring).slice(0, 2);
        const initialDate = new Date(ctx.session.timeslot.date); //update derived date from previous entry
        initialDate.setHours(Number(wroteHrs)); //set RAW hours
        initialDate.setMinutes(Number(wroteMins)); //set RAW mins
        // console.log("initialdate-2x",initialDate)
        ctx.session.timeslot.date = initialDate; // This is RAW input DATE by user
    };
    const parseTime = timeWrote.toString();
    const re = new RegExp('^[0-9]{3}$'); //check 3 digits => add 0 to front
    if (parseTime.match(re)) {
        const added = "0".concat(parseTime);
        ctx.session.timeslot.timing = added;
        convertHrsMins(added);
    }
    else {
        ctx.session.timeslot.timing = parseTime;
        convertHrsMins(timeWrote);
    }
    // Advance form to step for Calculate Output
    ctx.session.step = "calculate";
    ctx.session.suggestionTimeslots = await (0, UsersController_1.findUserChoice)(ctx.session); //find if it is amongst existing DB, else to add to suggestion
    console.log('>>>suggestionsTimeslot', ctx.session.suggestionTimeslots);
    console.log('>>>suggestionsTimeslot', ctx.session.suggestionTimeslots[0].invitedMembers);
    await ctx.reply(`Got it! These are the suggested timeslots that best match your choice: <b>${ctx.session.timeslot.date.getDate()} ${arrays_1.monthsArray[ctx.session.timeslot.date.getMonth()]} ${arrays_1.default[ctx.session.timeslot.date.getDay()]} ${ctx.session.timeslot.timing}hrs </b>\nPlease note: Once timeslot chosen, you have 3mins to join the group- else the slot will be opened up for others`, { reply_markup: calculateMenu, parse_mode: "HTML" });
});
const days_menu = new menu_1.Menu("days_menu");
days_menu
    .dynamic(() => {
    const range = new menu_1.MenuRange();
    for (let i = 0; i < 3; i++) {
        const thisDay = (i) => {
            const dateSpecified = new Date;
            return dateSpecified.setDate(dateSpecified.getDate() + i); //next date alr
        };
        const convertToDay = new Date(thisDay(i));
        const outText = (i) => {
            if (i === 0)
                return `Today`;
            else if (i === 1)
                return `${arrays_1.default[convertToDay.getDay()]} (Tomorrow)`;
            else
                return arrays_1.default[convertToDay.getDay()];
        };
        range.text(outText(i), (ctx) => {
            ctx.session.step = "time";
            ctx.session.timeslot = { date: convertToDay, day: arrays_1.default[convertToDay.getDay()] };
            ctx.menu.close();
            ctx.editMessageText(`Please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm).`, { parse_mode: "HTML" });
            console.log("ctx.session.timeslot.date", ctx.session.timeslot.date);
        })
            .row();
    }
    return range;
})
    .text("Go Back", (ctx) => {
    ctx.session.isDriving = { exist: undefined, spareCapacity: null };
    ctx.menu.nav("userDriver_menu");
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" });
});
const driver_menu = new menu_1.Menu("driver_menu")
    .dynamic(() => {
    const range = new menu_1.MenuRange();
    for (let i = 1; i < 5; i++) {
        range
            .text(`${i}`, (ctx) => {
            ctx.session.isDriving.spareCapacity = i;
            ctx.editMessageText(dayText(ctx.session.enterAL), { reply_markup: days_menu, parse_mode: "HTML" });
        })
            .row();
    }
    return range;
})
    .text("Go Back", (ctx) => {
    ctx.session.isDriving = { exist: undefined, spareCapacity: null };
    ctx.menu.nav("userDriver_menu");
});
const locationText = (enterLodge) => {
    if (enterLodge) {
        return `What <b>time</b> do you want to <b>reach Animal Lodge</b> ?`;
    }
    else
        return `What <b>time</b> do you want to <b>leave Animal Lodge</b> ?`;
};
const dayText = (enterLodge) => {
    if (enterLodge) {
        return `Which <b>day</b> do you want to <b>reach Animal Lodge</b> ?`;
    }
    else
        return `Which <b>day</b> do you want to <b>leave Animal Lodge</b> ?`;
};
const userDriver_menu = new menu_1.Menu("userDriver_menu")
    // .text("Passenger", (ctx) => ctx.reply("Passenger"))
    // .text("Driver", (ctx) => ctx.reply("Driver")).row()
    .submenu("Passenger", "days_menu", // navigation target menu
(ctx) => {
    ctx.session.isDriving.exist = false;
    ctx.session.isDriving.spareCapacity = null;
    ctx.editMessageText(dayText(ctx.session.enterAL), { parse_mode: "HTML" });
} // handler
)
    // .submenu(
    //     "Driver",
    //     "driver_menu", // navigation target menu
    //     (ctx) => {
    //         ctx.session.isDriving.exist = true
    //         ctx.editMessageText(`How many passengers can you take?`, { parse_mode: "HTML" })
    //     } // handler
    // )
    .row()
    .text("Go Back", (ctx) => {
    ctx.session.enterAL = undefined;
    ctx.editMessageText(`Are you a <b>Going</b> to Animal Lodge or <b>Leaving</b> Animal Lodge?`, { parse_mode: "HTML" });
    ctx.menu.nav("start-menu");
});
const userDriverText = () => `Are you a <b>Passenger</b> or <s>Driver</s>? (Driver discontinued due to regulation)`;
const start_menu = new menu_1.Menu("start-menu")
    // .text("Going to Animal Lodge", (ctx) => ctx.reply("Going to Animal Lodge", { reply_markup: userDriver_menu }))
    // .text("Leaving Animal Lodge", (ctx) => ctx.reply("Leaving Animal Lodge", { reply_markup: userDriver_menu })).row()
    .submenu("Going to Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" });
    ctx.session.enterAL = true;
    ctx.session.suggestionTimeslots = [];
} // handler
).row()
    .submenu("Leaving Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" }); // handler
    ctx.session.enterAL = false;
    ctx.session.suggestionTimeslots = [];
});
//REGISTER
// timeMenu.register(opMRTmenu)
calculateMenu.register(slotchosen_menu);
days_menu.register(calculateMenu);
userDriver_menu.register(driver_menu);
userDriver_menu.register(days_menu);
start_menu.register(userDriver_menu);
// main.register(settings, "dynamic");// Optionally, set a different parent.
// settings.register(timeMenu)
//Bot use
bot.use(calculateMenu);
// bot.use(driver_menu);
// bot.use(userDriver_menu);
bot.use(stepRouter);
bot.use(start_menu);
bot.command("start", async (ctx) => {
    ctx.session = initiallise;
    ctx.session.chatid = ctx.chat.id;
    ctx.session.username = ctx.chat.username;
    await ctx.reply(startText(), { reply_markup: start_menu, parse_mode: "HTML" });
});
const startText = () => `Are you a <b>Going</b> to Animal Lodge or <b>Leaving</b> Animal Lodge?`;
///////////////////////////////////////////////////////////////////////TESTING
bot.command("session", async (ctx) => {
    //await bot.api.sendMessage(427599753, "hihihihihi");
    console.log("session", ctx.session);
});
bot.command("add", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const item = ctx.match;
    console.log(item);
});
bot.command("menu", async (ctx) => {
    const msgtext = ctx.msg.text;
    console.log(msgtext);
});
bot.command("chatdb", async (ctx) => {
    const findFreeChat = await Chat_1.default.find({ membersInside: { $size: 0 } });
    console.log("findFreeChat", findFreeChat);
    console.log("findFreeChat[0]", findFreeChat[0]);
});
bot.command("counterdb", async (ctx) => {
    const counter = await counter_1.default.findOne();
    console.log("counter", counter);
    console.log("counterCounts", counter.counter);
    counter.counter++;
    console.log("counterCounts", counter.counter);
    await counter.save();
});
bot.command("adduser", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const username = ctx.chat;
    const chat = ctx;
    console.log("chat ", username);
    console.log("chatdetails", chat);
});
// bot.command("start", (ctx) => ctx.reply("Hello there!"));
// bot.command("menu", async (ctx) => {
//     // Send the menu.
//     await ctx.reply("Check out this menu:", { reply_markup: menu });
//   });
bot.on("message", (ctx) => ctx.reply("Got another message!"));
// bot.on("message", (ctx) => {
//     // Now `str` is of type `string`.
//     const str = ctx.session;
//     console.log(str)
// });
bot.use(dish_1.dishes);
exports.default = bot;
