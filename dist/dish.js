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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dishes = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
exports.dishes = new grammy_1.Composer();
const dishDatabase = [
    { id: "pasta", name: "Pasta" },
    { id: "pizza", name: "Pizza" },
    { id: "sushi", name: "Sushi" },
    { id: "entrct", name: "Entrecôte" },
];
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
exports.dishes.use(mainMenu);
exports.dishes.command("dish", (ctx) => ctx.reply(mainText, { reply_markup: mainMenu }));
exports.dishes.command("help", async (ctx) => {
    const text = "Send /start to see and rate dishes. Send /fav to list your favorites!";
    await ctx.reply(text);
});
exports.dishes.command("fav", async (ctx) => {
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
// dishes.catch(console.error.bind(console));
