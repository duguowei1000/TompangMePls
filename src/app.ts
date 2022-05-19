import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
// import { bot } from "./bot";
// import { Bot } from "grammy";
// import { Menu } from "@grammyjs/menu";
import { Bot, Context, session, SessionFlavor, Composer } from "grammy";
import { Menu, MenuRange } from "@grammyjs/menu";

//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);

let port = Number(process.env.PORT);
if (port == null ) {
  port = 3600;
}
console.log("port:",port)
console.log(">>>",process.env)
if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");

//////BOT
// export const bot = new Bot(`${process.env.BOT_TOKEN}`);
const bot = new Bot<MyContext>(`${process.env.BOT_TOKEN}`);

/** This is how the dishes look that this bot is managing */
interface Dish {
    id: string;
    name: string;
}

interface SessionData {
    favoriteIds: string[];
    username: string[];

}
type MyContext = Context & SessionFlavor<SessionData>;

const dishDatabase: Dish[] = [
    { id: "pasta", name: "Pasta" },
    { id: "pizza", name: "Pizza" },
    { id: "sushi", name: "Sushi" },
    { id: "entrct", name: "Entrecôte" },
];

bot.use(session({
    initial(): SessionData {
        return { favoriteIds: [], username: [] };
    },
}));

/**
 * All known dishes. Users can rate them to store which ones are their favorite
 * dishes.
 *
 * They can also decide to delete them. If a user decides to delete a dish, it
 * will be gone for everyone.
 */
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

// Create a dynamic menu that lists all dishes in the dishDatabase,
// one button each
const mainText = "Pick a dish to rate it!";
const mainMenu = new Menu<MyContext>("food");
mainMenu.dynamic(() => {
    const range = new MenuRange<MyContext>();
    for (const dish of dishDatabase) {
        range.submenu(
            { text: dish.name, payload: dish.id }, // label and payload
            "dish", // navigation target menu
            (ctx) => ctx.editMessageText(dishText(dish.name), { parse_mode: "HTML" }), // handler
        )
            .row();
    }
    return range;
});

// Create the sub-menu that is used for rendering dishes
const dishText = (dish: string) => `<b>${dish}</b>\n\nYour rating:`;
const dishMenu = new Menu<MyContext>("dish");
dishMenu.dynamic((ctx) => {
    const dish = ctx.match;
    if (typeof dish !== "string") throw new Error("No dish chosen!");
    return createDishMenu(dish);
});
/** Creates a menu that can render any given dish */
function createDishMenu(dish: string) {
    return new MenuRange<MyContext>()
        .text({
            text: (ctx) => ctx.session.favoriteIds.includes(dish) ? "Yummy!" : "Meh.",
            payload: dish,
        }, (ctx) => {
            const set = new Set(ctx.session.favoriteIds);
            if (!set.delete(dish)) set.add(dish);
            ctx.session.favoriteIds = Array.from(set.values());
            ctx.menu.update();
        })
        .row()
        .back({ text: "X Delete", payload: dish }, async (ctx) => {
            const index = dishDatabase.findIndex((d) => d.id === dish);
            console.log(index)
            dishDatabase.splice(index, 1);
            await ctx.editMessageText("Pick a dish to rate it!");
        })
        .row()
        .back({ text: "Back", payload: dish });
}

mainMenu.register(dishMenu);

bot.use(mainMenu);

bot.command(
    "start",
    (ctx) => ctx.reply(mainText, { reply_markup: mainMenu }),
);
bot.command(
    "help",
    async (ctx) => {
        const text =
            "Send /start to see and rate dishes. Send /fav to list your favorites!";
        await ctx.reply(text);
    },
);
bot.command("fav", async (ctx) => {
    const favs = ctx.session.favoriteIds;
    if (favs.length === 0) {
        await ctx.reply("You do not have any favorites yet!");
        return;
    }
    const names = favs
        .map((id) => dishDatabase.find((dish) => dish.id === id))
        .filter((dish): dish is Dish => dish !== undefined)
        .map((dish) => dish.name)
        .join("\n");
    await ctx.reply(`Those are your favorite dishes:\n\n${names}`);
});

bot.catch(console.error.bind(console));
/////////////FUNCTION for saving username and choice of time///////////
const saveUserChoice = (ctxt, i: number) => { 
    console.log(ctxt.chat)
    console.log(`${ctxt.chat.username} chose Time >>>`,scheduleDatabase[i].timeDisplay)
    
    outputSuggestedMRT(ctxt)
}

const outputSuggestedMRT = async (ctxt) => {
    // await ctxt.reply(
    //     ctxt.id,
    //     "*Hi\\!* _Welcome_ to [grammY](https://grammy.dev)\\.",
    //     // { parse_mode: "MarkdownV2" },
    //   );
}

////DYNAMIC MENU
const timeMenu = new Menu("timeMenu");
timeMenu
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic(() => {
    // Generate a part of the menu dynamically!
    const range = new MenuRange();
    for (let i = 0; i < scheduleDatabase.length -1; i++) {
        range
            .text(scheduleDatabase[i].timeDisplay, (ctx) => 
            {
            ctx.reply(
            `You chose ${scheduleDatabase[i].timeDisplay}`)
            //  console.log(ctx.chat)
             saveUserChoice(ctx, i)
             

        })
            .row();
    }
    return range;
})  
    .back("Go Back")
    // .text("Cancel", (ctx) => ctx.deleteMessage());
    
// timeMenu.register(opMRTmenu)    
bot.use(timeMenu);
bot.command("timemenu", async (ctx) => {
    await ctx.reply("Please choose the time you want to reach your ${Location}!", { reply_markup: timeMenu });
});
///////////////Submenu <> Going Back////////////////////////////////////////////////
const main = new Menu("root-menu")
  .text("Passenger", (ctx) => ctx.reply("Passenger"))
  .text("Driver", (ctx) => ctx.reply("Driver")).row()
  .submenu("timeSchedule", "timeMenu");

const settings = new Menu("credits-menu")
  .text("Show Credits", (ctx) => ctx.reply("Powered by grammY"))
  .back("Go Back");

main.register(timeMenu);
// main.register(settings, "dynamic");// Optionally, set a different parent.
// settings.register(timeMenu)

  bot.use(main);
  bot.command("submenu", async (ctx) => {
    await ctx.reply("Please state the time that you will want to reach AREA-1", { reply_markup: main });
});

///////////////////////////////////////////////////////////////////////TESTING


bot.command("add", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const item = ctx.match;
    console.log(item)
  });
bot.command("menu", (ctx) => {
// `item` will be 'apple pie' if a user sends '/add apple pie'.
const msgtext = ctx.msg.text;
console.log(msgtext)
});

bot.command("adduser", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const username = ctx.chat
    console.log(username)
    });
    //OUTPUTS
    // {
    //     id: 427599753,
    //     first_name: 'mrdgw',
    //     username: 'mrdgw',
    //     type: 'private'
    //   }

bot.command("start", (ctx) => ctx.reply("Hello there!"));
// bot.command("menu", async (ctx) => {
//     // Send the menu.
//     await ctx.reply("Check out this menu:", { reply_markup: menu });
//   });
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
// bot.start(); ###DONT USE THIS IN THE MIDDLE###


// bot.api.setWebhook(`${domain}/${botToken}`)
// console.log(`set Webhook at ${domain}/${botToken}`)

bot.on("message", (ctx) => {
    // Now `str` is of type `string`.
    const str = ctx.session;
    console.log(str)
  });

bot.start()
///EXPRESS
const app = express();

app.use(morgan("tiny"));
app.use(methodOverride("_method")); //put Delete
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World_yesyesyo!'))

//async await
app.post(`/${botToken}`, (req, res) => {
  
    try {
     console.log('reqbody', req.body)
    //  bot.handleUpdate(req.body, res)
     res.json({ message: req.body });
 
    } catch (error) {
      res.status(400).json({ error: error.message });
   }
 
 });

//  app.use(`${botToken}`, webhookCallback(bot, "express")); //no need "/"
// app.listen(Number(process.env.PORT), async () => {
//   console.log(`Example app listening on port ${port}!`)
//   console.log(`set Webhook at ${domain}/${botToken}`)
//   await bot.api.setWebhook(`${domain}/${botToken}`);
// });

// app.use(bot.api.webhookCallback(`/${botToken}`)) //must be at the end
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})