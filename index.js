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
    res.send("✅ API и бот работают!чё ты тут забыл, а это же сервер скрипта, а точно сюда зашёл)ай тигр за айпи спасибо гений) след раз умнее буть... а теперь пошёл нахyi");
});

// 🔁 Self-ping (30 сек) для логов Koyeb (не обязателен)
setInterval(() => {
    https.get("https://expected-kara-lynn-anus23323-840ae195.koyeb.app/", res => {
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

    if (message.content === "/help") {
    message.reply(
        "**Доступные команды бота для выдачи подписки в скрипте Nerest Project:**\n" +
        "`/выдать @user` — выдать подписку рабу\n" +
        "`/спиздить @user` — спиздить подписку у раба (не заслужил)\n" +
        "🔗 Дискорд сервер скрипта: https://discord.gg/saHwJfDH"
    );
}

    if (message.content.startsWith("/выдать")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.пошёл нахyi еблaн");
        if (!mention) return message.reply("❌ Укажите раба: `/выдать @user`");
        allowedUsers.add(mention.id);
        message.reply(`✅ Подписка выдана рабу <@${mention.id}> жду 100$`);
    }

    if (message.content.startsWith("/спиздить")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.пошёл нахyi еблaн");
        if (!mention) return message.reply("❌ Укажите пользователя у которого спиздить подписку: `/спиздить @user`");
        if (allowedUsers.delete(mention.id)) {
            message.reply(`❌ Подписку спиздили у <@${mention.id}>`);
        } else {
            message.reply(`ℹ️ У <@${mention.id}> не было доступа, ну всё пиздец тебе...`);
        }
    }
});

// Живой маршрут для self-ping (и UptimeRobot)
app.get("/", (req, res) => {
  res.send("✅ Nerest Project API работает");
});
// 🚀 Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 API слушает на порту ${PORT}`);
});

client.login(BOT_TOKEN);
