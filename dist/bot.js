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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
const router_1 = require("@grammyjs/router");
const UsersController_1 = require("./controllers/UsersController");
const dish_1 = require("./dish");
const arrays_1 = __importStar(require("./data/arrays"));
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
    timeslot: { day: null, timing: null },
    locationToMeet: "",
    suggestionTimeslots: [],
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
            for (const element of checkDriver) {
                if (element.isDriving.exist) {
                    return "Incl. Driver";
                }
                else
                    return "No Driver";
            }
        };
        range.text(`(${suggestOutput[i].timeslot.day}) ${suggestOutput[i].timeslot.timing} @ ${suggestOutput[i].locationToMeet} (${suggestOutput[i].invitedMembers?.length ?? 0}pax ${gotDriver(i)})`, (ctx) => {
            (0, UsersController_1.saveUserChoice)(ctx, suggestOutput[i]); //output invitelink
        })
            .row();
    }
    return range;
})
    .text("Go Back", (ctx) => {
    ctx.session.timeslot = { date: null, day: null, timing: null };
    ctx.session.step = "day";
    ctx.menu.nav("days_menu");
    ctx.editMessageText(`Out of range, please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm.)`, { parse_mode: "HTML" });
});
// .text("Cancel", (ctx) => ctx.deleteMessage());
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
    const parseTime = timeWrote.toString();
    const re = new RegExp('^[0-9]{3}$'); //check 3 digits => add 0 to front
    if (parseTime.match(re)) {
        const added = "0".concat(digits);
        ctx.session.timeslot.timing = added;
        console.log("added", added);
    }
    else
        ctx.session.timeslot.timing = parseTime;
    const wroteMins = String(timeWrote).slice(-2);
    const wroteHrs = String(timeWrote).slice(0, 2);
    const initialDate = new Date(ctx.session.timeslot.date); //update derived date from previous entry
    initialDate.setHours(Number(wroteHrs)); //set hours
    initialDate.setMinutes(Number(wroteMins)); //set mins
    ctx.session.timeslot.date = initialDate; //set user choice for date
    // Advance form to step for Calculate Output
    ctx.session.step = "calculate";
    ctx.session.suggestionTimeslots = await (0, UsersController_1.findUserChoice)(ctx.session); //find if it is amongst existing DB, else to add to suggestion
    console.log('>>>suggestionsTimeslot', ctx.session.suggestionTimeslots);
    await ctx.reply(`Got it! These are the suggested timeslots that best match your choice: <b>${ctx.session.timeslot.date.getDate()} ${arrays_1.monthsArray[ctx.session.timeslot.date.getMonth()]} ${arrays_1.default[ctx.session.timeslot.date.getDay()]} ${ctx.session.timeslot.timing}hrs </b>
    `, { reply_markup: calculateMenu, parse_mode: "HTML" });
});
const days_menu = new menu_1.Menu("days_menu");
days_menu
    .dynamic(() => {
    const range = new menu_1.MenuRange();
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        const dateSpecified = new Date();
        const thisDay = () => {
            if ((d.getDay() + i) > 6) {
                return (d.getDay() + i - 6);
            }
            else
                return (d.getDay() + i); //day in integer
        };
        dateSpecified.setDate(dateSpecified.getDate() + i); //date in GMT+8
        // console.log("date"+dateSpecified+"day"+thisDay() )
        const outText = (i) => {
            if (i === 0)
                return `Today`;
            else if (i === 1)
                return `${arrays_1.default[thisDay()]} (Tomorrow)`;
            else
                return arrays_1.default[thisDay()];
        };
        range.text(outText(i), (ctx) => {
            ctx.session.step = "time";
            ctx.session.timeslot = { date: dateSpecified, day: arrays_1.default[thisDay()] };
            ctx.menu.close();
            ctx.editMessageText(`Please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm).`, { parse_mode: "HTML" });
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
    .submenu("Driver", "driver_menu", // navigation target menu
(ctx) => {
    ctx.session.isDriving.exist = true;
    ctx.editMessageText(`How many passengers can you take?`, { parse_mode: "HTML" });
} // handler
).row()
    .back("Go Back");
const userDriverText = () => `Are you a <b>Passenger</b> or <b>Driver</b>? `;
const start_menu = new menu_1.Menu("start-menu")
    // .text("Going to Animal Lodge", (ctx) => ctx.reply("Going to Animal Lodge", { reply_markup: userDriver_menu }))
    // .text("Leaving Animal Lodge", (ctx) => ctx.reply("Leaving Animal Lodge", { reply_markup: userDriver_menu })).row()
    .submenu("Going to Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" });
    ctx.session = {
        step: "idle",
        chatid: null,
        username: "",
        enterAL: true,
        isDriving: { exist: undefined, spareCapacity: null },
        timeslot: { day: null, timing: null },
        locationToMeet: "",
        suggestionTimeslots: undefined,
    };
} // handler
).row()
    .submenu("Leaving Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" }); // handler
    ctx.session.enterAL = false;
});
//REGISTER
// timeMenu.register(opMRTmenu)
// days_menu.register(timeMenu);  
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
// bot.on("message", (ctx) => ctx.reply("Got another message!"))
// bot.on("message", (ctx) => {
//     // Now `str` is of type `string`.
//     const str = ctx.session;
//     console.log(str)
// });
bot.use(dish_1.dishes);
exports.default = bot;
