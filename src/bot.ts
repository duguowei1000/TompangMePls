import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
import { Bot, Context, session, SessionFlavor, Composer, InlineKeyboard } from "grammy";
import { Menu, MenuRange } from "@grammyjs/menu";
import mongoose from "mongoose";
import chatsController from "./controllers/ChatsController";
import usersController from "./controllers/UsersController";

//Parameters
// const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);

let port = Number(process.env.PORT);
if (port == null) {
    port = 3600;
}
//////BOT

console.log(">>> in bot.ts >>>",process.env.BOT_TOKEN)
if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");
const bot = new Bot(`${process.env.BOT_TOKEN}`);

bot.command("start", (ctx) => ctx.reply("Hello there!"));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

export default bot
