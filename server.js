const WebSocket = require("ws");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

// Загружаем данные пользователей и муты
let data = { users: {}, mutes: {} };
const DATA_FILE = "data.json";

if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Сохраняем данные в файл
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket сервер запущен на порту ${PORT}`);

// Функция отправки всем
function broadcast(msg, except=null) {
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN && c !== except) {
      c.send(msg);
    }
  });
}

// Проверка мьютов
function isMuted(nick) {
  if (!data.mutes[nick]) return false;
  const now = Date.now();
  if (now > data.mutes[nick]) {
    delete data.mutes[nick];
    saveData();
    return false;
  }
  return true;
}

wss.on("connection", ws => {
  ws.nick = null;
  ws.isAdmin = false;

  ws.send("[Система] Подключено к групповому чату! Для регистрации: /register Ник Пароль");

  ws.on("message", msg => {
    const text = msg.toString().trim();

    // Команда регистрации
    if (text.startsWith("/register ")) {
      const parts = text.split(" ");
      if (parts.length < 3) return ws.send("[Система] Использование: /register Ник Пароль");
      const nick = parts[1];
      const pass = parts.slice(2).join(" ");

      if (data.users[nick]) return ws.send("[Система] Этот ник уже занят!");
      data.users[nick] = { password: pass, regDate: Date.now() };
      saveData();
      ws.send(`[Система] Регистрация успешна! Ваш ник: ${nick}`);
      return;
    }

    // Команда логина
    if (text.startsWith("/login ")) {
      const parts = text.split(" ");
      if (parts.length < 3) return ws.send("[Система] Использование: /login Ник Пароль");
      const nick = parts[1];
      const pass = parts.slice(2).join(" ");

      if (!data.users[nick] || data.users[nick].password !== pass) {
        return ws.send("[Система] Неверный ник или пароль!");
      }

      ws.nick = nick;
      ws.send(`[Система] Вы вошли как ${nick}`);
      return;
    }

    // Команда админа (только пароль)
    if (text.startsWith("/password ")) {
      const pass = text.slice(10).trim();
      if (pass === "123456789Qq") {  // твой секретный админ пароль
        ws.isAdmin = true;
        ws.send("[Система] Вы получили права администратора!");
      } else {
        ws.send("[Система] Неверный пароль администратора.");
      }
      return;
    }

    // Команда мут (только для админа)
    if (text.startsWith("/мут ")) {
      if (!ws.isAdmin) return ws.send("[Система] Команда доступна только администратору.");
      const parts = text.split(" ");
      if (parts.length < 3) return ws.send("[Система] Использование: /мут Ник ВремяВМинуты");
      const target = parts[1];
      const minutes = parseInt(parts[2]);
      if (!data.users[target]) return ws.send("[Система] Игрок не найден!");
      const until = Date.now() + minutes*60*1000;
      data.mutes[target] = until;
      saveData();
      ws.send(`[Система] Игрок ${target} замьючен на ${minutes} мин.`);
      broadcast(`[Система] Игрок ${target} был замьючен админом.`, ws);
      return;
    }

    // Проверка, что пользователь залогинен
    if (!ws.nick) return ws.send("[Система] Сначала войдите через /login Ник Пароль");

    // Проверка мьюта
    if (isMuted(ws.nick)) return ws.send("[Система] Вы замьючены и не можете писать сообщения.");

    // Отправка сообщения всем
    broadcast(`${ws.nick}: ${text}`);
  });
});
