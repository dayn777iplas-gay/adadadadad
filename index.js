const express = require("express");
const cors = require("cors");
const https = require("https");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const allowedUsers = new Set();

// 🔑 Переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = "832278157066240040"; // ← твой Discord ID

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 📡 API для проверки доступа
app.post("/verify", (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ status: "error", message: "Missing ID" });

    const approved = allowedUsers.has(id);
    res.json({ status: approved ? "approved" : "denied" });
});

// 🌍 Живой маршрут
app.get("/", (req, res) => {
    res.send("✅ API и бот работают!");
});

// 🔁 Self-ping (30 сек) для логов Koyeb (не обязателен)
setInterval(() => {
    https.get("https://nerest-project.koyeb.app/", res => {
        console.log("🔁 Self-ping:", res.statusCode);
    }).on("error", err => {
        console.error("❌ Self-ping error:", err.message);
    });
}, 1000 * 30);

// 🤖 Discord бот
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`🤖 Бот ${client.user.tag} запущен`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const isAdmin = message.author.id === OWNER_ID;
    const mention = message.mentions.users.first();

    if (message.content.startsWith("!разрешить")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.");
        if (!mention) return message.reply("❌ Укажите пользователя: `!разрешить @user`");
        allowedUsers.add(mention.id);
        message.reply(`✅ Доступ выдан для <@${mention.id}>`);
    }

    if (message.content.startsWith("!забрать")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.");
        if (!mention) return message.reply("❌ Укажите пользователя: `!забрать @user`");
        if (allowedUsers.delete(mention.id)) {
            message.reply(`❌ Доступ отозван у <@${mention.id}>`);
        } else {
            message.reply(`ℹ️ У <@${mention.id}> не было доступа`);
        }
    }
});

// 🚀 Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 API слушает на порту ${PORT}`);
});

client.login(BOT_TOKEN);