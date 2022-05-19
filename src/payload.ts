import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
// import { bot } from "./bot";
// import { Bot } from "grammy";
// import { Menu } from "@grammyjs/menu";
import { Bot, Context, session, SessionFlavor, Composer } from "grammy";
import { Menu, MenuRange } from "@grammyjs/menu";

//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);

let port = Number(process.env.PORT);
if (port == null ) {
  port = 3600;
}
console.log("port:",port)
console.log(">>>",process.env)
if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.");

//////BOT
// export const bot = new Bot(`${process.env.BOT_TOKEN}`);
const bot = new Bot(`${process.env.BOT_TOKEN}`);
function generatePayload(ctx: Context) {
    return ctx.from?.first_name ?? "";
  }
  
  const menu = new Menu("store-author-name-in-payload")
    .text(
      { text: "I know my creator", payload: generatePayload },
      (ctx) => ctx.reply(`I was created by ${ctx.match}!`),
    );
  
  bot.use(menu);
  bot.command("menu", async (ctx) => {
    await ctx.reply("I created a menu!", { reply_markup: menu });
  });
/////////////

  const menuDynamic = new Menu("dynamic");
  menuDynamic
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic(() => {
      // Generate a part of the menu dynamically!
      const range = new MenuRange();
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

bot.start()
///EXPRESS
const app = express();

app.use(morgan("tiny"));
app.use(methodOverride("_method")); //put Delete
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World_yesyesyo!'))

//async await
app.post(`/${botToken}`, (req, res) => {
  
    try {
     console.log('reqbody', req.body)
    //  bot.handleUpdate(req.body, res)
     res.json({ message: req.body });
 
    } catch (error) {
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
  console.log(`Example app listening on port ${port}!`)
})