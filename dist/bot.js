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
const time_1 = __importDefault(require("./data/time"));
const day_1 = __importDefault(require("./data/day"));
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
            timeslot: { day: null, timing: null },
            locationToMeet: "",
            favoriteIds: [],
        };
    },
}));
// Use router
const stepRouter = new router_1.Router((ctx) => ctx.session.step);
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
    for (let i = 0; i < time_1.default.length - 1; i++) {
        range.text(time_1.default[i].timeDisplay, (ctx) => {
            //  console.log(ctx.chat)
            const time = time_1.default[i].timeDisplay;
            const destinationChoice = 'Jurong East';
            (0, UsersController_1.saveUserChoice)(ctx, time, destinationChoice);
        })
            .row();
    }
    return range;
})
    .text("Go Back", (ctx) => {
    ctx.session.isDriving = { exist: undefined, spareCapacity: null };
    ctx.session.timeslot = { day: null, timing: null };
    ctx.menu.nav("userDriver_menu");
    ctx.editMessageText(userDriverText(), { parse_mode: "HTML" });
});
// .text("Cancel", (ctx) => ctx.deleteMessage());
// Define step that handles the time.
stepRouter.route("time", async (ctx) => {
    const day = parseInt(ctx.msg?.text ?? "", 10);
    if (isNaN(day) || day < 1 || 31 < day) {
        await ctx.reply("That is not a valid day, try again!");
        return;
    }
    ctx.session.timeslot.timing = day;
    // Advance form to step for month
    // ctx.session.step = "month";
    // await ctx.reply("Got it! Now, send me the month!", {
    //   reply_markup: {
    //     one_time_keyboard: true,
    //     keyboard: new Keyboard()
    //       .text("Jan").text("Feb").text("Mar").row()
    //       .text("Apr").text("May").text("Jun").row()
    //       .text("Jul").text("Aug").text("Sep").row()
    //       .text("Oct").text("Nov").text("Dec").build(),
    //   },
    // });
});
const days_menu = new menu_1.Menu("days_menu");
days_menu
    .dynamic(() => {
    const range = new menu_1.MenuRange();
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        const thisDay = d.getDay() + i; //day in integer
        const outText = (i) => {
            if (i === 0)
                return `Today`;
            else if (i === 1)
                return `${day_1.default[thisDay]} (Tomorrow)`;
            else
                return day_1.default[thisDay];
        };
        range.text(outText(i), (ctx) => {
            ctx.session.timeslot.day = day_1.default[thisDay];
            ctx.editMessageText(locationText(ctx.session.enterAL));
            ctx.menu.close();
            ctx.session.step = "time"; //, {reply_markup: timeMenu, parse_mode: "HTML" })
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
days_menu.register(timeMenu);
userDriver_menu.register(driver_menu);
userDriver_menu.register(days_menu);
start_menu.register(userDriver_menu);
// main.register(settings, "dynamic");// Optionally, set a different parent.
// settings.register(timeMenu)
//Bot use
// bot.use(timeMenu);
// bot.use(driver_menu);
// bot.use(userDriver_menu);
bot.use(start_menu);
bot.command("start", async (ctx) => {
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
