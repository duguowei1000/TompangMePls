import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import methodOverride from "method-override"
import morgan from "morgan";
import { webhookCallback } from "grammy";
import mongoose from "mongoose";
import chatsController from "./controllers/ChatsController";
import usersController from "./controllers/UsersController";
import countersController from "./controllers/CountersController";
import  bot  from "./bot";

//Parameters

const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);

const mongoURI = String(process.env.MONGO_URI);
mongoose.connect(mongoURI, {}, () => {
    console.log("connected to mongodb");
});

let port = Number(process.env.PORT);
if (port == null) {
    port = 3600;
}

const production = false
if (!production ){
    console.log("doing local test")
    console.log("bot.start()")
    bot.start()
}else{
    console.log("Production mode")
}


///EXPRESS
const app = express();

app.use(morgan("tiny"));
app.use(methodOverride("_method")); //put Delete
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express.json());
app.use("/chat", chatsController);
app.use("/user", usersController);
app.use("/counter", countersController);

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


if (production){
app.use(`/${botToken}`, webhookCallback(bot, "express")); //no need "/"//must be at the end
}
//remember to set domain config in HEROKU
app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`)


  if (production){
    console.log(`set Webhook at ${domain}/${botToken}`)
  await bot.api.setWebhook(`${domain}/${botToken}`);
  }
});
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`)
// })