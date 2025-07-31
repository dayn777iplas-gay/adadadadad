const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const allowedUsers = new Set();

// 🔑 Вставь сюда свой токен и ID администратора
const BOT_TOKEN =
    "MTQwMDI5ODcwNzgxOTMwMjkzMw.G0Mwr2.w38DHfJnxHk1ztH_f-9--2HqtKFtIQNeo4KnPM";
const OWNER_ID = "832278157066240040"; // ← твой Discord ID

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 📡 API для userscript
app.post("/verify", (req, res) => {
    const { id } = req.body;
    if (!id)
        return res.status(400).json({ status: "error", message: "Missing ID" });

    const approved = allowedUsers.has(id);
    res.json({ status: approved ? "approved" : "denied" });
});

// 🤖 Discord бот
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`🤖 Бот вошёл как ${client.user.tag}`);
});

// 📩 Обработка команд
client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const isAdmin = message.author.id === OWNER_ID;
    const isAllowCmd = message.content.startsWith("!разрешить");
    const isRevokeCmd = message.content.startsWith("!забрать");

    if ((isAllowCmd || isRevokeCmd) && !isAdmin) {
        return message.reply(
            "⛔ У вас нет прав использовать эту команду.(можно по желанию наxyй)",
        );
    }

    if (!isAdmin) return;

    const mention = message.mentions.users.first();
    if (!mention) {
        return message.reply(
            "❌ Укажите пользователя: `!разрешить @user` или `!забрать @user`",
        );
    }

    if (isAllowCmd) {
        allowedUsers.add(mention.id);
        message.reply(`✅ Доступ выдан для <@${mention.id}>`);
        console.log(`✅ ID ${mention.id} добавлен`);
    }

    if (isRevokeCmd) {
        if (allowedUsers.delete(mention.id)) {
            message.reply(`❌ Доступ отозван у <@${mention.id}>`);
            console.log(`❌ ID ${mention.id} удалён`);
        } else {
            message.reply(`ℹ️ У <@${mention.id}> не было доступа`);
        }
    }
});

// 🌐 Живой маршрут для UptimeRobot
app.get("/", (req, res) => {
    res.send("✅ API работает");
});

// 🚀 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 API слушает на порту ${PORT}`);
});

// 🤖 Запуск бота
client.login(BOT_TOKEN);
