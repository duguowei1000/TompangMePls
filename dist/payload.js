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
//////BOT
// export const bot = new Bot(`${process.env.BOT_TOKEN}`);
const bot = new grammy_1.Bot(`${process.env.BOT_TOKEN}`);
function generatePayload(ctx) {
    return ctx.from?.first_name ?? "";
}
const menu = new menu_1.Menu("store-author-name-in-payload")
    .text({ text: "I know my creator", payload: generatePayload }, (ctx) => ctx.reply(`I was created by ${ctx.match}!`));
bot.use(menu);
bot.command("menu", async (ctx) => {
    await ctx.reply("I created a menu!", { reply_markup: menu });
});
/////////////
const menuDynamic = new menu_1.Menu("dynamic");
menuDynamic
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic(() => {
    // Generate a part of the menu dynamically!
    const range = new menu_1.MenuRange();
    for (let i = 0; i < 3; i++) {
        range
            .text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`))
            .row();
    }
    return range;
})
    .text("Cancel", (ctx) => ctx.deleteMessage());
bot.use(menuDynamic);
bot.command("Dynamic", async (ctx) => {
    await ctx.reply("I created a dynamic menu!", { reply_markup: menuDynamic });
});
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
