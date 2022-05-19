import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
// import { bot } from "./bot";
// import { Bot } from "grammy";
// import { Menu } from "@grammyjs/menu";
import { Bot, Context, session, SessionFlavor,InlineKeyboard,Keyboard } from "grammy";
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
// // Create a simple menu.
// const menu = new Menu("my-menu-identifier")
//   .text("A", (ctx) => ctx.reply("You pressed A!")).row()
//   .text("B", (ctx) => ctx.reply("You pressed B!"));

// // Make it interactive.
// bot.use(menu);

// bot.command("startmenu", async (ctx) => {
//   // Send the menu.
//   await ctx.reply("Check out this menu:", { reply_markup: menu });
// });
// ////

// Create a button with the user's name, which will greet them when pressed.

// bot.on("message", (ctx) => {
//     // `txt` will be a `string` when processing text messages.
//     // It will be `undefined` if the received message does not have any message text,
//     // e.g. photos, stickers, and other messages.
//     // const txt = ctx.message.text;
//     const txt = ctx.message.chat;
//     console.log(txt)
//   });
// const menu = new Menu("greet-me")
//   .text(
//     (ctx) => `Greet ${ctx.from?.first_name ?? "me"}!`, // dynamic label
//     (ctx) => ctx.reply(`Hello ${ctx.from.first_name}!`), // handler
//   );
//   bot.use(menu);
//   bot.command("startmenu", async (ctx) => {
//   // Send the menu.
//   await ctx.reply("Check out this menu:", { reply_markup: menu });
// });
///////////////////////////////////


// const bot = new Bot(botToken);

// This bot will collect some basic statistics about each chat. They can be
// retrieved with the `/stats` command.

// This is the data that will be saved per chat.

interface SessionData {
    messages: number
    edits: number
}

// flavor the context type to include sessions
type MyContext = Context & SessionFlavor<SessionData>

// Create a bot
const bot = new Bot<MyContext>(botToken) // <-- place your token inside this string

// Note that using `session()` will only save the data in-memory. If the Node
// process terminates, all data will be lost. A bot running in production will
// need some sort of database or file storage to persist data between restarts.
// Confer the grammY documentation to find out how to store data with your bot.
bot.use(session({ initial: () => ({ messages: 1, edits: 0 }) }))

// Collect statistics
bot.on('message', async (ctx, next) => {
    ctx.session.messages++
    await next()
})
bot.on('edited_message', async (ctx, next) => {
    ctx.session.edits++
    await next()
})

bot.filter(ctx => ctx.chat?.type === 'private').command('start', ctx =>
    ctx.reply(
        'Hi there! I will count the messages in this chat so you can get your /stats!'
    )
)

bot.on(':new_chat_members:me', ctx =>
    ctx.reply(
        'Hi everyone! I will count the messages in this chat so you can get your /stats!'
    )
)

// Send statistics upon `/stats`
bot.command('stats', async ctx => {
    const stats = ctx.session

    // Format stats to string
    const message = `You sent <b>${
        stats.messages
    } messages</b> since I'm here! You edited messages <b>${
        stats.edits
    } times</b>—that is <b>${
        stats.edits / stats.messages
    } edits</b> per message on average!`

    // Send message in same chat using `reply` shortcut. Don't forget to `await`!
    await ctx.reply(message, { parse_mode: 'HTML' })
})

// Catch errors and log them
bot.catch(err => console.error(err))

// Start bot!
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})


///////////////Submenu <> Going Back////////////////////////////////////////////////
const main = new Menu("root-menu")
  .text("Welcome", (ctx) => ctx.reply("Hi!")).row()
  .submenu("Credits", "credits-menu");

const settings = new Menu("credits-menu")
  .text("Show Credits", (ctx) => ctx.reply("Powered by grammY"))
  .back("Go Back");

main.register(settings);
// main.register(settings, "dynamic");// Optionally, set a different parent.
settings.register(timeMenu)

  bot.use(main);
  bot.command("submenu", async (ctx) => {
    await ctx.reply("Please state the time that you will want to reach AREA-1", { reply_markup: main });
});


//////INLINE KEYBOARD
const inlineKeyboard = new InlineKeyboard().text("click", "click-payload");

// Send a keyboard along with a message.
bot.command("inline", async (ctx) => {
  await ctx.reply("Curious? Click me!", { reply_markup: inlineKeyboard });
});

// Wait for click events with specific callback data.
bot.callbackQuery("click-payload", async (ctx) => {
//   await ctx.answerCallbackQuery({
//     text: "You were curious, indeed!",
//   });
await ctx.reply("Hello hello", { reply_markup: inlineKeyboard });
});

//////////////// POSTAL CODE//////

const keyboard = new Keyboard()
  .text("7").text("8").text("9").text("*").row()
  .text("4").text("5").text("6").text("/").row()
  .text("1").text("2").text("3").text("-").row()
  .text("0").text(".").text("=").text("+");




//   const root_menu = new InlineKeyboard()
//         .text("Passenger", "Passenger-payload")
//         .text("Driver", "Driver-payload")
//         .text("timeschedule", "timeschedule-payload")
// // Send a keyboard along with a message.
// bot.command("inline", async (ctx) => {
//   await ctx.reply("Curious? Click me!", { reply_markup: root_menu });
// });

// // Wait for click events with specific callback data.
// bot.callbackQuery("Passenger-payload", async (ctx) => {
// await ctx.reply("Passenger", { reply_markup: timeMenu });
// });
// bot.callbackQuery("Driver-payload", async (ctx) => {
//     await ctx.reply("Driver", { reply_markup: timeMenu });
//     });
// bot.callbackQuery("timeschedule-payload", async (ctx) => {
// await ctx.reply("timeschedule", { reply_markup: timeMenu });
// });
