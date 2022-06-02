import * as dotenv from "dotenv";
dotenv.config();
import { Bot, Context, session, SessionFlavor, Composer, InlineKeyboard, Keyboard } from "grammy";
import { Menu, MenuRange, } from "@grammyjs/menu";
import { Router } from "@grammyjs/router";
import { saveUserChoice, findUserChoice } from "./controllers/UsersController";
import { dishes } from "./dish";
import scheduleDatabase from "./data/timeFunctions";
import integerToDay, {monthsArray} from "./data/arrays";
import { suggestions } from "./data/invitedata";
import { time } from "console";
import Chat from "./models/Chat";

//////BOT
console.log(">>> in bot.ts >>>", process.env.BOT_TOKEN)
if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");
const bot = new Bot(`${process.env.BOT_TOKEN}`);

interface SessionData {
    step: "idle" | "userdriver" | "driver" | "days" | "time" | "calculate";
    timeslot: any,
    favoriteIds: string[];
    username: string[];
    suggestionTimeslots: any[];

}
type MyContext = Context & SessionFlavor<SessionData>;

bot.use(session({
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
}

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


const calculateMenu = new Menu("calculateMenu");
calculateMenu
    .dynamic((ctx) => {
        const range = new MenuRange();
        const suggestOutput = ctx.session.suggestionTimeslots
        for (let i = 0; i < suggestOutput.length; i++) {
            const gotDriver = (i: number) => {
                const checkDriver = suggestOutput[i]?.invitedMembers //optional chaining for specific timeslots
                if (checkDriver === undefined) return "No Driver"
                if(checkDriver.some((el)=>  {
                    return (el.isDriving.exist===true)
                })) { return "Incl. Driver" } 
                else 
                return "No Driver"
                
            }
            if(!suggestOutput[i].enterAL){//Output for leaving AL
                range.text( 
                    `${suggestOutput[i].timeslot.day} ${suggestOutput[i].timeslot.timing} drop@${suggestOutput[i].locationToMeet} (${suggestOutput[i].invitedMembers?.length ?? 0}pax ${gotDriver(i)})`,
                    (ctx) => {saveUserChoice(ctx, suggestOutput[i])}).row(); //output invitelink
            }else if(suggestOutput[i].enterAL){
                range.text( //Output for entering AL
                    `${suggestOutput[i].timeslot.day} ${suggestOutput[i].timeslot.timing} @ ${suggestOutput[i].locationToMeet} (${suggestOutput[i].invitedMembers?.length ?? 0}pax ${gotDriver(i)})`,
                    (ctx) => {saveUserChoice(ctx, suggestOutput[i])}).row(); //output invitelink
            }
            
        }
        return range;
    }
    )
    .text("Go Back", (ctx) => {
        ctx.session.timeslot = { date: null, day: null, timing: null }
        ctx.session.step = "day";
        ctx.menu.nav("days_menu")
        ctx.editMessageText(dayText(ctx.session.enterAL), { parse_mode: "HTML" })//`Out of range, please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm.)`, { parse_mode: "HTML" })
    })
// .text("Cancel", (ctx) => ctx.deleteMessage());


// Use router
const stepRouter = new Router<MyContext>((ctx) => ctx.session.step);

// Define step that handles the time.
stepRouter.route("time", async (ctx) => {
    const timeWrote = parseInt(ctx.msg?.text ?? "", 10);
    console.log("timewrote", timeWrote)


    if (isNaN(timeWrote)) {
        await ctx.reply("That is not a valid day, try again!");
        return;
    } else if (timeWrote < 600 || 2200 < timeWrote) {
        await ctx.reply(`Out of range, please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm`,
            { parse_mode: "HTML" });
        return;
    }

    const convertHrsMins = (timestring)=>{  //Update Date Object to specified Hours and Mins
        const wroteMins = String(timestring).slice(-2)
        const wroteHrs = String(timestring).slice(0, 2)
        const initialDate = new Date(ctx.session.timeslot.date) //update derived date from previous entry
        initialDate.setHours(Number(wroteHrs));  //set RAW hours
        initialDate.setMinutes(Number(wroteMins)); //set RAW mins
        // console.log("initialdate-2x",initialDate)
        ctx.session.timeslot.date = initialDate // This is RAW input DATE by user
    }
    const parseTime = timeWrote.toString()
    const re = new RegExp('^[0-9]{3}$') //check 3 digits => add 0 to front
    if (parseTime.match(re)) {
        const added = "0".concat(parseTime)
        ctx.session.timeslot.timing = added
        convertHrsMins(added)
    }else{
        ctx.session.timeslot.timing = parseTime;
        convertHrsMins(timeWrote)
    } 

    // Advance form to step for Calculate Output
    ctx.session.step = "calculate";
    ctx.session.suggestionTimeslots = await findUserChoice(ctx.session)   //find if it is amongst existing DB, else to add to suggestion
    console.log('>>>suggestionsTimeslot', ctx.session.suggestionTimeslots)
    console.log('>>>suggestionsTimeslot', ctx.session.suggestionTimeslots[0].invitedMembers)
    await ctx.reply(`Got it! These are the suggested timeslots that best match your choice: <b>${ctx.session.timeslot.date.getDate()} ${monthsArray[ctx.session.timeslot.date.getMonth()]} ${integerToDay[ctx.session.timeslot.date.getDay()]} ${ctx.session.timeslot.timing}hrs </b>
    `, { reply_markup: calculateMenu , parse_mode: "HTML" });
})

const days_menu = new Menu("days_menu");
days_menu
    .dynamic(() => {
        const range = new MenuRange();
        for (let i = 0; i < 3; i++) {

            const thisDay = (i:any) => {
                const dateSpecified = new Date
                return dateSpecified.setDate(dateSpecified.getDate() +i) //next date alr
            }
            const convertToDay = new Date(thisDay(i)) 
            const outText = (i) => {
                if (i === 0) return `Today`
                else if (i === 1) return `${integerToDay[convertToDay.getDay()]} (Tomorrow)`
                else return integerToDay[convertToDay.getDay()]
            }
            range.text(outText(i), (ctx) => {
                ctx.session.step = "time"
                ctx.session.timeslot = { date: convertToDay, day: integerToDay[convertToDay.getDay()] }   
                ctx.menu.close()
                ctx.editMessageText(`Please write a time between <i>0600hrs</i> to <i>2200hrs</i> in 24hr format (e.g <b>1730</b> for 5:30pm).`, { parse_mode: "HTML" })
                console.log("ctx.session.timeslot.date", ctx.session.timeslot.date)
            })
                .row();
        }
        
        return range;
    }
    )
    .text("Go Back", (ctx) => {
        ctx.session.isDriving = { exist: undefined, spareCapacity: null }
        ctx.menu.nav("userDriver_menu")
        ctx.editMessageText(userDriverText(), { parse_mode: "HTML" })
    })

const driver_menu = new Menu("driver_menu")
    .dynamic(() => {
        const range = new MenuRange();
        for (let i = 1; i < 5; i++) {
            range
                .text(`${i}`, (ctx) => {
                    ctx.session.isDriving.spareCapacity = i
                    ctx.editMessageText(dayText(ctx.session.enterAL), { reply_markup: days_menu, parse_mode: "HTML" })
                })
                .row()
        }
        return range;
    }
    )
    .text("Go Back", (ctx) => {
        ctx.session.isDriving = { exist: undefined, spareCapacity: null }
        ctx.menu.nav("userDriver_menu")
    })


const locationText = (enterLodge) => {
    if (enterLodge) {
        return `What <b>time</b> do you want to <b>reach Animal Lodge</b> ?`;
    } else return `What <b>time</b> do you want to <b>leave Animal Lodge</b> ?`
}
const dayText = (enterLodge) => {
    if (enterLodge) {
        return `Which <b>day</b> do you want to <b>reach Animal Lodge</b> ?`;
    } else return `Which <b>day</b> do you want to <b>leave Animal Lodge</b> ?`
}
const userDriver_menu = new Menu("userDriver_menu")
    // .text("Passenger", (ctx) => ctx.reply("Passenger"))
    // .text("Driver", (ctx) => ctx.reply("Driver")).row()
    .submenu(
        "Passenger",
        "days_menu", // navigation target menu
        (ctx) => {
            ctx.session.isDriving.exist = false
            ctx.session.isDriving.spareCapacity = null
            ctx.editMessageText(dayText(ctx.session.enterAL), { parse_mode: "HTML" })
        } // handler
    )
    .submenu(
        "Driver",
        "driver_menu", // navigation target menu
        (ctx) => {
            ctx.session.isDriving.exist = true
            ctx.editMessageText(`How many passengers can you take?`, { parse_mode: "HTML" })
        } // handler
    ).row()
    .text("Go Back", (ctx) => {
        ctx.session.enterAL = undefined
        ctx.editMessageText(`Are you a <b>Going</b> to Animal Lodge or <b>Leaving</b> Animal Lodge?`, { parse_mode: "HTML" })
        ctx.menu.nav("start-menu")
    })

const userDriverText = () => `Are you a <b>Passenger</b> or <b>Driver</b>? `;
const start_menu = new Menu("start-menu")
    // .text("Going to Animal Lodge", (ctx) => ctx.reply("Going to Animal Lodge", { reply_markup: userDriver_menu }))
    // .text("Leaving Animal Lodge", (ctx) => ctx.reply("Leaving Animal Lodge", { reply_markup: userDriver_menu })).row()
    .submenu(
        "Going to Animal Lodge",
        "userDriver_menu", // navigation target menu
        (ctx) => {
            ctx.editMessageText(userDriverText(), { parse_mode: "HTML" })
            ctx.session = {
                step: "idle",
                chatid: null,
                username: "",
                enterAL: true,
                isDriving: { exist: undefined, spareCapacity: null },
                timeslot: { day: null, timing: null },
                locationToMeet: "",
                suggestionTimeslots: undefined,
            }
        } // handler
    ).row()
    .submenu(
        "Leaving Animal Lodge",
        "userDriver_menu", // navigation target menu
        (ctx) => {
            ctx.editMessageText(userDriverText(), { parse_mode: "HTML" }) // handler
            ctx.session.enterAL = false
        }
    )

//REGISTER
// timeMenu.register(opMRTmenu)
days_menu.register(calculateMenu);  
userDriver_menu.register(driver_menu)
userDriver_menu.register(days_menu);
start_menu.register(userDriver_menu);
// main.register(settings, "dynamic");// Optionally, set a different parent.
// settings.register(timeMenu)

//Bot use
bot.use(calculateMenu);
// bot.use(driver_menu);
// bot.use(userDriver_menu);
bot.use(stepRouter)
bot.use(start_menu);
bot.command("start", async (ctx) => {
    ctx.session = initiallise
    ctx.session.chatid = ctx.chat.id
    ctx.session.username = ctx.chat.username
    await ctx.reply(startText(), { reply_markup: start_menu, parse_mode: "HTML" });
});
const startText = () => `Are you a <b>Going</b> to Animal Lodge or <b>Leaving</b> Animal Lodge?`;


///////////////////////////////////////////////////////////////////////TESTING

bot.command("session", async (ctx) => {
    //await bot.api.sendMessage(427599753, "hihihihihi");
    console.log("session", ctx.session)
})

bot.command("add", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const item = ctx.match;
    console.log(item)
});
bot.command("menu", async (ctx) => {
    const msgtext = ctx.msg.text;
    console.log(msgtext)

});

bot.command("chatdb", async (ctx) => {
    const findFreeChat = await Chat.find({ membersInside: {  $size: 0   } });
    console.log("findFreeChat",findFreeChat)
    console.log("findFreeChat[0]",findFreeChat[0])

});

bot.command("adduser", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const username = ctx.chat
    const chat = ctx;
    console.log("chat ", username)
    console.log("chatdetails", chat)
});

// bot.command("start", (ctx) => ctx.reply("Hello there!"));
// bot.command("menu", async (ctx) => {
//     // Send the menu.
//     await ctx.reply("Check out this menu:", { reply_markup: menu });
//   });
bot.on("message", (ctx) => ctx.reply("Got another message!"))


// bot.on("message", (ctx) => {
//     // Now `str` is of type `string`.
//     const str = ctx.session;
//     console.log(str)
// });

bot.use(dishes)
export default bot
