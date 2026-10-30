const { Telegraf, Markup } = require("telegraf");

// Токен бота — вставь свой из BotFather (или задай через переменную BOT_TOKEN)
const BOT_TOKEN = process.env.BOT_TOKEN || "ВСТАВЬ_СЮДА_ТОКЕН_ОТ_BOTFATHER";

// Ссылка на Mini App
const WEBAPP_URL = process.env.WEBAPP_URL || "https://comfy-crepe-95751e.netlify.app";

if (!BOT_TOKEN || BOT_TOKEN.includes("ВСТАВЬ")) {
  console.error("Ошибка: укажи BOT_TOKEN (токен от @BotFather)");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Кнопка, которая открывает Mini App
function playKeyboard(lang = "ru") {
  const text = lang === "en" ? "Play TeleTetris" : "Играть в TeleTetris";
  return Markup.keyboard([
    [Markup.button.webApp(text, WEBAPP_URL)],
  ]).resize();
}

// Тексты
const texts = {
  ru: {
    start:
      "Привет! 👋\n\nЭто <b>TeleTetris</b> — классический Тетрис прямо в Telegram.\n\nНажми кнопку ниже, чтобы начать игру.",
    help:
      "Команды:\n/start — приветствие и кнопка игры\n/play — открыть Тетрис\n\nИли просто нажми кнопку меню слева от поля ввода.",
    play: "Открываю игру 🎮",
  },
  en: {
    start:
      "Hi! 👋\n\nThis is <b>TeleTetris</b> — classic Tetris inside Telegram.\n\nTap the button below to start playing.",
    help:
      "Commands:\n/start — welcome + play button\n/play — open Tetris\n\nOr use the menu button left of the input field.",
    play: "Opening the game 🎮",
  },
};

function getLang(ctx) {
  const code = ctx.from?.language_code || "ru";
  return code.startsWith("en") ? "en" : "ru";
}

bot.start(async (ctx) => {
  const lang = getLang(ctx);
  await ctx.reply(texts[lang].start, {
    parse_mode: "HTML",
    ...playKeyboard(lang),
  });
});

bot.command("play", async (ctx) => {
  const lang = getLang(ctx);
  await ctx.reply(texts[lang].play, playKeyboard(lang));
});

bot.command("help", async (ctx) => {
  const lang = getLang(ctx);
  await ctx.reply(texts[lang].help, playKeyboard(lang));
});

// Любое другое сообщение — тоже показать кнопку
bot.on("text", async (ctx) => {
  const lang = getLang(ctx);
  await ctx.reply(texts[lang].start, {
    parse_mode: "HTML",
    ...playKeyboard(lang),
  });
});

bot.launch().then(() => {
  console.log("TeleTetris bot is running");
});

// Корректная остановка
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
