import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
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

console.log(">>>",process.env.BOT_TOKEN)
const domain = String(process.env.DOMAIN);
const secretPath = String(process.env.BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(`/${secretPath}`, webhookCallback(bot, "express"));

app.listen(Number(process.env.PORT), async () => {
  // Make sure it is `https` not `http`!
  console.log(`${domain}/${secretPath}`)
  await bot.api.setWebhook(`${domain}/${secretPath}`);
});