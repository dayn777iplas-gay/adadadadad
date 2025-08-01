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

    const statuses = [
        { name: "Выдает подписку рабам", type: 0 },        // Играет в
        { name: "Пишет скрипт Nerest Project", type: 0 },  // Играет в
        { name: "рабов", type: 2 },                        // Слушает
        { name: "на рабов", type: 3 },                     // Смотрит
    ];

    let i = 0;
    setInterval(() => {
        client.user.setPresence({
            activities: [statuses[i]],
            status: "online"
        });
        i = (i + 1) % statuses.length;
    }, 10000); // меняет статус каждые 10 секунд
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const isAdmin = message.author.id === OWNER_ID;
    const mention = message.mentions.users.first();

    if (message.content === "!help") {
    message.reply(
        "**📜 Доступные команды Nerest Project Бота:**\n\n" +
        "**👑 Админские команды:**\n" +
        "`!выдать @user` — выдать подписку рабу\n" +
        "`!спиздить @user` — спиздить подписку у раба (не заслужил)\n" +
        "`!проверить @user` — проверить наличие подписки у рабов\n" +
        "`!список` — список всех рабов с подпиской\n\n" +
        "**💬 Доступные всем пользователям:**\n" +
        "`!бань @user` — бан раба в канале 😂\n" +
        "`!муть @user` — мут раба в чате 🔇\n\n" +
        "🔗 **Дискорд сервер скрипта:** https://discord.gg/saHwJfDH"
    );
}

    // 👇 Все пользователи могут использовать
if (message.content.startsWith("!бань")) {
    const mention = message.mentions.users.first();
    if (!mention) return message.reply("❌ Укажи, кого забанить: `!бань @user`");

    message.reply(`🚫 <@${mention.id}> был забанен по причине: "Раб без подписки" 😂`);
}

if (message.content.startsWith("!муть")) {
    const mention = message.mentions.users.first();
    if (!mention) return message.reply("❌ Укажи, кого замутить: `!муть @user`");

    message.reply(`🔇 <@${mention.id}> был замучен. Больше ни слова от этого раба.`);
}

// 👇 Только для админа
if (message.content.startsWith("!проверить")) {
    if (!isAdmin) return message.reply("❌ Ты не админ, пошёл нахyi");

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("❌ Укажи пользователя: `!проверить @user`");

    if (allowedUsers.has(mention.id)) {
        message.reply(`✅ У <@${mention.id}> есть доступ к скрипту.`);
    } else {
        message.reply(`❌ У <@${mention.id}> нет подписки.`);
    }
}

if (message.content === "!список") {
    if (!isAdmin) return message.reply("❌ Ты не админ, пошёл нахyi");

    if (allowedUsers.size === 0) {
        return message.reply("📭 Ни один раб ещё не получил подписку.");
    }

    const list = [...allowedUsers].map(id => `<@${id}>`).join("\n");
    message.reply(`📋 Подписанные рабы:\n${list}`);
}

    if (message.content.startsWith("!выдать")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.пошёл нахyi еблaн");
        if (!mention) return message.reply("❌ Укажите раба: `!выдать @user`");
        allowedUsers.add(mention.id);
        message.reply(`✅ Подписка выдана рабу <@${mention.id}> жду 100$`);
    }

    if (message.content.startsWith("!спиздить")) {
        if (!isAdmin) return message.reply("❌ У вас нет прав для этой команды.пошёл нахyi еблaн");
        if (!mention) return message.reply("❌ Укажите пользователя у которого спиздить подписку: `!спиздить @user`");
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
