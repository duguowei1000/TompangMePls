import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override";
import morgan from "morgan";
// import { bot } from "./bot";
import { Bot } from "grammy";
// import { Menu } from "@grammyjs/menu";
//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);
let port = Number(process.env.PORT);
if (port == null) {
    port = 3600;
}
console.log("port:", port);
console.log(">>>", process.env);
//////BOT
export const bot = new Bot(`${process.env.BOT_TOKEN}`);
// // Create a simple menu.
// const menu = new Menu("my-menu-identifier")
//   .text("A", (ctx) => ctx.reply("You pressed A!")).row()
//   .text("B", (ctx) => ctx.reply("You pressed B!"));
// // Make it interactive.
// bot.use(menu);
if (process.env.BOT_TOKEN == null)
    throw Error("BOT_TOKEN is missing.");
bot.command("start", (ctx) => ctx.reply("Hello there!"));
// bot.command("menu", async (ctx) => {
//     // Send the menu.
//     await ctx.reply("Check out this menu:", { reply_markup: menu });
//   });
bot.on("message", (ctx) => ctx.reply("Got another message!"));
// bot.start(); ###DONT USE THIS IN THE MIDDLE###
// bot.api.setWebhook(`${domain}/${botToken}`)
// console.log(`set Webhook at ${domain}/${botToken}`)
bot.start();
///EXPRESS
const app = express();
app.use(morgan("tiny"));
app.use(methodOverride("_method")); //put Delete
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express.json());
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
//  app.use(`${botToken}`, webhookCallback(bot, "express")); //no need "/"
// app.listen(Number(process.env.PORT), async () => {
//   console.log(`Example app listening on port ${port}!`)
//   console.log(`set Webhook at ${domain}/${botToken}`)
//   await bot.api.setWebhook(`${domain}/${botToken}`);
// });
// app.use(bot.api.webhookCallback(`/${botToken}`)) //must be at the end
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
