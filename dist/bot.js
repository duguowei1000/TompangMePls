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
//////BOT
console.log(">>> in bot.ts >>>", process.env.BOT_TOKEN);
if (process.env.BOT_TOKEN == null)
    throw Error("BOT_TOKEN is missing.");
const bot = new grammy_1.Bot(`${process.env.BOT_TOKEN}`);
bot.use((0, grammy_1.session)({
    initial() {
        return {
            step: "idle",
            chatid: [],
            username: "",
            enterAL: undefined,
            isDriving: { exist: undefined, spareCapacity: 1 },
            timeslot: "",
            locationToMeet: "",
            favoriteIds: [],
        };
    },
}));
// Use router
const stepRouter = new router_1.Router((ctx) => ctx.session.step);
const scheduleDatabase = [
    { time: 900, timeDisplay: "900" },
    { time: 930, timeDisplay: "930" },
    { time: 1000, timeDisplay: "1000" },
    { time: 1030, timeDisplay: "1030" },
    { time: 1100, timeDisplay: "1100" },
    { time: 1230, timeDisplay: "1230" },
    { time: 1300, timeDisplay: "1300" },
    { time: 1330, timeDisplay: "1330" },
];
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
const timeMenu = new menu_1.Menu("timeMenu");
timeMenu
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic(() => {
    // Generate a part of the menu dynamically!
    const range = new menu_1.MenuRange();
    for (let i = 0; i < scheduleDatabase.length - 1; i++) {
        range
            .text(scheduleDatabase[i].timeDisplay, (ctx) => {
            //  console.log(ctx.chat)
            const time = scheduleDatabase[i].timeDisplay;
            const destinationChoice = 'Jurong East';
            (0, UsersController_1.saveUserChoice)(ctx, time, destinationChoice);
        })
            .row();
    }
    return range;
})
    .back("Go Back");
// .text("Cancel", (ctx) => ctx.deleteMessage());
const locationText = (enterLodge) => {
    if (enterLodge) {
        return `What <b>time</b> do you want to <b>reach Animal Lodge</b> ?`;
    }
    else
        return `What <b>time</b> do you want to <b>leave Animal Lodge</b> ?`;
};
const userDriver_menu = new menu_1.Menu("userDriver_menu")
    // .text("Passenger", (ctx) => ctx.reply("Passenger"))
    // .text("Driver", (ctx) => ctx.reply("Driver")).row()
    .submenu("Passenger", "timeMenu", // navigation target menu
(ctx) => {
    ctx.session.isDriving = false;
    ctx.editMessageText(locationText(ctx.session.enterAL), { parse_mode: "HTML" });
} // handler
)
    .submenu("Driver", "timeMenu", // navigation target menu
(ctx) => {
    ctx.session.isDriving = true;
    ctx.editMessageText(locationText(ctx.session.enterAL), { parse_mode: "HTML" });
} // handler
).row()
    .back("Go Back");
const start_menu = new menu_1.Menu("start-menu")
    // .text("Going to Animal Lodge", (ctx) => ctx.reply("Going to Animal Lodge", { reply_markup: userDriver_menu }))
    // .text("Leaving Animal Lodge", (ctx) => ctx.reply("Leaving Animal Lodge", { reply_markup: userDriver_menu })).row()
    .submenu("Going to Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" });
    ctx.session.enterAL = true;
} // handler
).row()
    .submenu("Leaving Animal Lodge", "userDriver_menu", // navigation target menu
(ctx) => {
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" }); // handler
    ctx.session.enterAL = false;
});
//REGISTER
// timeMenu.register(opMRTmenu)   
userDriver_menu.register(timeMenu);
start_menu.register(userDriver_menu);
// main.register(settings, "dynamic");// Optionally, set a different parent.
// settings.register(timeMenu)
//Bot use
bot.use(timeMenu);
bot.command("timemenu", async (ctx) => {
    await ctx.reply(`Please choose the time you want to reach your <b>Location</b>!`, { reply_markup: timeMenu });
});
const userDriverText = () => `Are you a <b>Driver</b> or <b>Passenger</b>`;
bot.use(userDriver_menu);
bot.command("start", async (ctx) => {
    await ctx.reply(startText(), { reply_markup: start_menu, parse_mode: "HTML" });
});
const startText = () => `Are you a <b>Going</b> to Animal Lodge or <b>Leaving</b> Animal Lodge?`;
bot.use(start_menu);
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
//OUTPUTS
// {
//     id: 427599753,
//     first_name: 'mrdgw',
//     username: 'mrdgw',
//     type: 'private'
//   }
// const settings = new Menu("credits-menu")
//     .text("Show Credits", (ctx) => ctx.reply("Powered by grammY",
//     ))
//     .back("Go Back").row();
// bot.use(settings)
// bot.command("settings", async (ctx) => {
//     await ctx.reply("Are you a Driver or Passenger", { reply_markup: settings });
// });
// bot.command("start", (ctx) => ctx.reply("Hello there!"));
// bot.command("menu", async (ctx) => {
//     // Send the menu.
//     await ctx.reply("Check out this menu:", { reply_markup: menu });
//   });
// bot.on("message", (ctx) => ctx.reply("Got another message!"))
bot.on("message", (ctx) => {
    // Now `str` is of type `string`.
    const str = ctx.session;
    console.log(str);
});
bot.use(dish_1.dishes);
exports.default = bot;
