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
const grammy_1 = require("grammy");
const mongoose_1 = __importDefault(require("mongoose"));
const ChatsController_1 = __importDefault(require("./controllers/ChatsController"));
const UsersController_1 = __importDefault(require("./controllers/UsersController"));
const bot_1 = __importDefault(require("./bot"));
//Parameters
const botToken = String(process.env.BOT_TOKEN);
const domain = String(process.env.DOMAIN);
const mongoURI = String(process.env.MONGO_URI);
mongoose_1.default.connect(mongoURI, {}, () => {
    console.log("connected to mongodb");
});
let port = Number(process.env.PORT);
if (port == null) {
    port = 3600;
}
const production = false;
if (!production) {
    console.log("doing local test");
    console.log("bot.start()");
    bot_1.default.start();
}
else {
    console.log("Production mode");
}
///EXPRESS
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("tiny"));
app.use((0, method_override_1.default)("_method")); //put Delete
app.use(express_1.default.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(express_1.default.json());
app.use("/chat", ChatsController_1.default);
app.use("/user", UsersController_1.default);
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
if (production) {
    app.use(`/${botToken}`, (0, grammy_1.webhookCallback)(bot_1.default, "express")); //no need "/"//must be at the end
}
//remember to set domain config in HEROKU
app.listen(port, async () => {
    console.log(`Example app listening on port ${port}!`);
    if (production) {
        console.log(`set Webhook at ${domain}/${botToken}`);
        await bot_1.default.api.setWebhook(`${domain}/${botToken}`);
    }
});
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`)
// })
