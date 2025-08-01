const express = require("express");
const cors = require("cors");
const https = require("https");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const allowedUsers = new Set();
// 🔑 Переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = "832278157066240040"; // ← твой Discord ID
const adminUsers = new Set([OWNER_ID]); // сюда можно будет добавлять других админов


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

    const isAdmin = adminUsers.has(message.author.id);
    const mention = message.mentions.users.first();
    
if (message.content === "!ктоя") {
    const randomId = Math.floor(Math.random() * 900) + 100;
    message.reply(`Ты — раб №${randomId} из моей коллекции 🧠`);
}

if (message.content.startsWith("!повысить")) {
    if (message.author.id !== OWNER_ID) return message.reply("❌ Ты не главный рабовладелец.");
    if (!mention) return message.reply("❌ Укажи пользователя: `!повысить @user`");
    adminUsers.add(mention.id);
    message.reply(`✅ <@${mention.id}> теперь тоже может управлять рабами!`);
}


    if (message.content === "!help") {
    message.reply(
        "**📜 Доступные команды Nerest Project Бота:**\n\n" +
        "**👑 Админские команды:**\n" +
        "`!выдать @user` — выдать подписку рабу\n" +
        "`!спиздить @user` — спиздить подписку у раба (не заслужил)\n" +
        "`!проверить @user` — проверить наличие подписки у рабов\n" +
        "`!список` — список всех рабов с подпиской и рабовладельцев\n" +
        "`!обнулить` — обнулить весь список рабов 👹\n" +
        "`!повысить @user` — дать другому рабовладельцу админ-доступ 👑\n" +
        "`!понизить @user` — отобрать админ-доступ у рабовладельца ❌\n\n" +
        "**💬 Доступные всем пользователям:**\n" +
        "`!бань @user` — бан раба в канале 😂\n" +
        "`!муть @user` — мут раба в чате 🔇\n" +
        "`!ктораб` — случайный раб дня 👀\n" +
        "`!дуэль @user` — дуэль на выживание ⚔️\n" +
        "`!починить` — починить всё (кроме тебя)\n" +
        "`!ктоя` — узнать, кто ты в системе бота 🧠\n\n" +
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
// 💬 Команда !починить
if (message.content === "!починить") {
    return message.reply("✅ Все баги устранены. Кроме одного... тебя.");
}

if (message.content.startsWith("!понизить")) {
    if (message.author.id !== OWNER_ID) return message.reply("❌ Только главный рабовладелец может понижать.");
    if (!mention) return message.reply("❌ Укажи работорговца: `!понизить @user`");
    if (mention.id === OWNER_ID) return message.reply("❌ Себя не понизишь, царь.");

    if (adminUsers.delete(mention.id)) {
        message.reply(`☠️ <@${mention.id}> больше не работорговец.`);
    } else {
        message.reply(`ℹ️ <@${mention.id}> не был работорговцем.`);
    }
}

// 💬 Команда !ктораб
if (message.content === "!ктораб") {
    (async () => {
        const members = await message.guild.members.fetch();
        const nonBotMembers = members.filter(m => !m.user.bot);
        const randomMember = nonBotMembers.random();

        if (randomMember) {
            message.channel.send(`Сегодняшний раб дня: ${randomMember}`);
        } else {
            message.channel.send("Не удалось выбрать раба дня 😔");
        }
    })();
}

// 💬 Команда !дуэль @user
if (message.content.startsWith("!дуэль")) {
    const opponent = message.mentions.users.first();
    if (!opponent) return message.reply("❌ Укажи с кем дуэль: `!дуэль @user`");

    const winner = Math.random() < 0.5 ? message.author : opponent;
    return message.reply(`⚔️ Дуэль завершена! Победил(а) ${winner}.`);
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

if (message.content === "!обнулить") {
    if (message.author.id !== OWNER_ID) return message.reply("❌ У тебя нет прав, смертный.");
    allowedUsers.clear();
    return message.reply("💀 Все рабы освобождены... *со смехом злодея*");
}

if (message.content === "!список") {
    if (!isAdmin) return message.reply("❌ Ты не админ, пошёл нахyi");

    const admins = [...adminUsers].map(id => `<@${id}>`).join("\n") || "🚫 Никого";
    const slaves = [...allowedUsers].filter(id => !adminUsers.has(id)).map(id => `<@${id}>`).join("\n") || "🚫 Никого";

    message.reply(`📋 **Работорговцы:**\n${admins}\n\n📋 **Рабы с подпиской:**\n${slaves}`);
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
