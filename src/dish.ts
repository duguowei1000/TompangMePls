import * as dotenv from "dotenv";
dotenv.config();
import { Bot, Context, session, SessionFlavor, Composer, InlineKeyboard } from "grammy";
import { Menu, MenuRange } from "@grammyjs/menu";
import { saveUserChoice} from "./controllers/UsersController";

export const dishes = new Composer();
/**
 * All known dishes. Users can rate them to store which ones are their favorite
 * dishes.
 *
 * They can also decide to delete them. If a user decides to delete a dish, it
 * will be gone for everyone.
 */

/** This is how the dishes look that this bot is managing */
interface Dish {
    id: string;
    name: string;
}

interface SessionData {
    favoriteIds: string[];
    username: string[];

}
type MyContext = Context & SessionFlavor<SessionData>;

const dishDatabase: Dish[] = [
    { id: "pasta", name: "Pasta" },
    { id: "pizza", name: "Pizza" },
    { id: "sushi", name: "Sushi" },
    { id: "entrct", name: "Entrecôte" },
];
// Create a dynamic menu that lists all dishes in the dishDatabase,
// one button each
const mainText = "Pick a dish to rate it!";
const mainMenu = new Menu<MyContext>("food");
mainMenu.dynamic(() => {
    const range = new MenuRange<MyContext>();
    for (const dish of dishDatabase) {
        range.submenu(
            { text: dish.name, payload: dish.id }, // label and payload
            "dish", // navigation target menu
            (ctx) => ctx.editMessageText(dishText(dish.name), { parse_mode: "HTML" }), // handler
        )
            .row();
    }
    return range;
});

// Create the sub-menu that is used for rendering dishes
const dishText = (dish: string) => `<b>${dish}</b>\n\nYour rating:`;
const dishMenu = new Menu<MyContext>("dish");
dishMenu.dynamic((ctx) => {
    const dish = ctx.match;
    if (typeof dish !== "string") throw new Error("No dish chosen!");
    return createDishMenu(dish);
});
/** Creates a menu that can render any given dish */
function createDishMenu(dish: string) {
    return new MenuRange<MyContext>()
        .text({
            text: (ctx) => ctx.session.favoriteIds.includes(dish) ? "Yummy!" : "Meh.",
            payload: dish,
        }, (ctx) => {
            const set = new Set(ctx.session.favoriteIds);
            if (!set.delete(dish)) set.add(dish);
            ctx.session.favoriteIds = Array.from(set.values());
            ctx.menu.update();
        })
        .row()
        .back({ text: "X Delete", payload: dish }, async (ctx) => {
            const index = dishDatabase.findIndex((d) => d.id === dish);
            console.log(index)
            dishDatabase.splice(index, 1);
            await ctx.editMessageText("Pick a dish to rate it!");
        })
        .row()
        .back({ text: "Back", payload: dish });
}

mainMenu.register(dishMenu);

dishes.use(mainMenu);

dishes.command(
    "dish",
    (ctx) => ctx.reply(mainText, { reply_markup: mainMenu }),
);
dishes.command(
    "help",
    async (ctx) => {
        const text =
            "Send /start to see and rate dishes. Send /fav to list your favorites!";
        await ctx.reply(text);
    },
);
dishes.command("fav", async (ctx) => {
    const favs = ctx.session.favoriteIds;
    if (favs.length === 0) {
        await ctx.reply("You do not have any favorites yet!");
        return;
    }
    const names = favs
        .map((id) => dishDatabase.find((dish) => dish.id === id))
        .filter((dish): dish is Dish => dish !== undefined)
        .map((dish) => dish.name)
        .join("\n");
    await ctx.reply(`Those are your favorite dishes:\n\n${names}`);
});

// dishes.catch(console.error.bind(console));