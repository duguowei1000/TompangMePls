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
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
const morgan_1 = __importDefault(require("morgan"));
// import { bot } from "./bot";
// import { Bot } from "grammy";
// import { Menu } from "@grammyjs/menu";
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);
let port = Number(process.env.PORT);
if (port == null) {
    port = 3600;
}
console.log("port:", port);
console.log(">>>", process.env);
if (process.env.BOT_TOKEN == null)
    throw Error("BOT_TOKEN is missing.");
// Create a bot
const bot = new grammy_1.Bot(botToken); // <-- place your token inside this string
// Note that using `session()` will only save the data in-memory. If the Node
// process terminates, all data will be lost. A bot running in production will
// need some sort of database or file storage to persist data between restarts.
// Confer the grammY documentation to find out how to store data with your bot.
bot.use((0, grammy_1.session)({ initial: () => ({ messages: 1, edits: 0 }) }));
// Collect statistics
bot.on('message', async (ctx, next) => {
    ctx.session.messages++;
    await next();
});
bot.on('edited_message', async (ctx, next) => {
    ctx.session.edits++;
    await next();
});
bot.filter(ctx => ctx.chat?.type === 'private').command('start', ctx => ctx.reply('Hi there! I will count the messages in this chat so you can get your /stats!'));
bot.on(':new_chat_members:me', ctx => ctx.reply('Hi everyone! I will count the messages in this chat so you can get your /stats!'));
// Send statistics upon `/stats`
bot.command('stats', async (ctx) => {
    const stats = ctx.session;
    // Format stats to string
    const message = `You sent <b>${stats.messages} messages</b> since I'm here! You edited messages <b>${stats.edits} times</b>—that is <b>${stats.edits / stats.messages} edits</b> per message on average!`;
    // Send message in same chat using `reply` shortcut. Don't forget to `await`!
    await ctx.reply(message, { parse_mode: 'HTML' });
});
// Catch errors and log them
bot.catch(err => console.error(err));
// Start bot!
bot.start();
///EXPRESS
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("tiny"));
app.use((0, method_override_1.default)("_method")); //put Delete
app.use(express_1.default.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express_1.default.json());
app.get('/', (req, res) => res.send('Hello World_yesyesyo!'));
//async await
app.post(`/${botToken}`, (req, res) => {
    try {
        console.log('reqbody', req.body);
        //  bot.handleUpdate(req.body, res)
        res.json({ message: req.body });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
///////////////Submenu <> Going Back////////////////////////////////////////////////
const main = new menu_1.Menu("root-menu")
    .text("Welcome", (ctx) => ctx.reply("Hi!")).row()
    .submenu("Credits", "credits-menu");
const settings = new menu_1.Menu("credits-menu")
    .text("Show Credits", (ctx) => ctx.reply("Powered by grammY"))
    .back("Go Back");
main.register(settings);
// main.register(settings, "dynamic");// Optionally, set a different parent.
settings.register(timeMenu);
bot.use(main);
bot.command("submenu", async (ctx) => {
    await ctx.reply("Please state the time that you will want to reach AREA-1", { reply_markup: main });
});
//////INLINE KEYBOARD
const inlineKeyboard = new grammy_1.InlineKeyboard().text("click", "click-payload");
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
const keyboard = new grammy_1.Keyboard()
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
