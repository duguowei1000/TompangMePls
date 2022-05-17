import { Bot } from "grammy";

if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");
export const bot = new Bot(`${process.env.BOT_TOKEN}`);

bot.command("start", (ctx) => ctx.reply("Hello there!"));
bot.on("message", (ctx) => ctx.reply("Got another message!"));