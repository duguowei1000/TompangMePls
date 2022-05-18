import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
// import { bot } from "./bot";


let port = Number(process.env.PORT);
if (port == null || port == "") {
  port = 3600;
}
console.log("port:",port)

import { Bot } from "grammy";

console.log(">>>",process.env)
if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");
export const bot = new Bot(`${process.env.BOT_TOKEN}`);

bot.command("start", (ctx) => ctx.reply("Hello there!"));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);
const app = express();


app.use(morgan("tiny"));
app.use(methodOverride("_method")); //put Delete
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World_yesyesyo!'))

app.use(`/${botToken}`, webhookCallback(bot, "express"));

//async await
app.post(`/${botToken}`, (req, res) => {
  
    try {
     bot.handleUpdate(req.body, res)
     res.json({ message: req.body });
     console.log(req.body)
 
    } catch (error) {
      res.status(400).json({ error: error.message });
   }
 
 });

app.listen(Number(process.env.PORT), async () => {
  // Make sure it is `https` not `http`!
  console.log(`Example app listening on port ${port}!`)
  console.log(`${domain}/${botToken}`)
  await bot.api.setWebhook(`${domain}/${botToken}`);
});