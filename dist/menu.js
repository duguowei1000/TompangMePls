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
/**
 * All known dishes. Users can rate them to store which ones are their favorite
 * dishes.
 *
 * They can also decide to delete them. If a user decides to delete a dish, it
 * will be gone for everyone.
 */
const dishDatabase = [
    { id: "pasta", name: "Pasta" },
    { id: "pizza", name: "Pizza" },
    { id: "sushi", name: "Sushi" },
    { id: "entrct", name: "Entrecôte" },
];
const bot = new grammy_1.Bot(botToken);
bot.use((0, grammy_1.session)({
    initial() {
        return { favoriteIds: [] };
    },
}));
// Create a dynamic menu that lists all dishes in the dishDatabase,
// one button each
const mainText = "Pick a dish to rate it!";
const mainMenu = new menu_1.Menu("food");
mainMenu.dynamic(() => {
    const range = new menu_1.MenuRange();
    for (const dish of dishDatabase) {
        range.submenu({ text: dish.name, payload: dish.id }, // label and payload
        "dish", // navigation target menu
        (ctx) => ctx.editMessageText(dishText(dish.name), { parse_mode: "HTML" }))
            .row();
    }
    return range;
});
// Create the sub-menu that is used for rendering dishes
const dishText = (dish) => `<b>${dish}</b>\n\nYour rating:`;
const dishMenu = new menu_1.Menu("dish");
dishMenu.dynamic((ctx) => {
    const dish = ctx.match;
    if (typeof dish !== "string")
        throw new Error("No dish chosen!");
    return createDishMenu(dish);
});
/** Creates a menu that can render any given dish */
function createDishMenu(dish) {
    return new menu_1.MenuRange()
        .text({
        text: (ctx) => ctx.session.favoriteIds.includes(dish) ? "Yummy!" : "Meh.",
        payload: dish,
    }, (ctx) => {
        const set = new Set(ctx.session.favoriteIds);
        if (!set.delete(dish))
            set.add(dish);
        ctx.session.favoriteIds = Array.from(set.values());
        ctx.menu.update();
    })
        .row()
        .back({ text: "X Delete", payload: dish }, async (ctx) => {
        const index = dishDatabase.findIndex((d) => d.id === dish);
        console.log(index);
        dishDatabase.splice(index, 1);
        await ctx.editMessageText("Pick a dish to rate it!");
    })
        .row()
        .back({ text: "Back", payload: dish });
}
mainMenu.register(dishMenu);
bot.use(mainMenu);
bot.command("start", (ctx) => ctx.reply(mainText, { reply_markup: mainMenu }));
bot.command("help", async (ctx) => {
    const text = "Send /start to see and rate dishes. Send /fav to list your favorites!";
    await ctx.reply(text);
});
bot.command("fav", async (ctx) => {
    const favs = ctx.session.favoriteIds;
    if (favs.length === 0) {
        await ctx.reply("You do not have any favorites yet!");
        return;
    }
    const names = favs
        .map((id) => dishDatabase.find((dish) => dish.id === id))
        .filter((dish) => dish !== undefined)
        .map((dish) => dish.name)
        .join("\n");
    await ctx.reply(`Those are your favorite dishes:\n\n${names}`);
});
bot.catch(console.error.bind(console));
///////////////////////////////////////////////////////////////////////TESTING
bot.command("add", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const item = ctx.match;
    console.log(item);
});
bot.command("menu", (ctx) => {
    // `item` will be 'apple pie' if a user sends '/add apple pie'.
    const msgtext = ctx.msg.text;
    console.log(msgtext);
});
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
    console.log(str);
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
