import 'dotenv/config';
import {Bot, GrammyError, HttpError, InlineKeyboard} from 'grammy';
import * as mongoose from "mongoose";
import {start} from "./commands/index.js";
import {hydrate} from "@grammyjs/hydrate";
import {MyContext} from "./types.js";
import {User} from "./models/User.js";
import {Button} from "./keyboards/index.js";

if(!process.env.BOT_TOKEN) {
  throw new Error('Bot token is not defined');
}
const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

bot.use(hydrate());

bot.command('start', start);

// Ответ на любое сообщение

bot.on('message:text', (ctx) => {
  ctx.reply(ctx.message.text);
  console.log(ctx.from)
});
bot.callbackQuery('menu', (ctx) => {
  ctx.answerCallbackQuery();

  ctx.callbackQuery.message?.editText(
      "Вы в главном меню!\nВыберите варианты кнопок",
      {
        reply_markup: new InlineKeyboard()
            .text('Товары', 'products').row()
            .text('Профиль', 'profile').row(),
      }
  )
})

bot.callbackQuery('products', (ctx) => {
  ctx.answerCallbackQuery();
  ctx.callbackQuery.message?.editText("Вы находитесь в разделе товары", {reply_markup: Button.back});
})

bot.callbackQuery('profile', async (ctx) => {
  await ctx.answerCallbackQuery();
  const user = await User.findOne({telegramId: ctx.from.id});
  await ctx.callbackQuery.message?.editText(`Ваш профиль:\nID: ${user!.telegramId}\nName: ${user!.username}`, {reply_markup: Button.back});
})

// Обработка ошибок согласно документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

async function startBot() {
  if(!process.env.MONGODB_URI) {
    throw new Error('Mongo URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    bot.start();
    console.log('MongoDB Connected & Bot Started');
  } catch (error) {
    console.error('Error in startBot:', error);
  }
}

startBot();
