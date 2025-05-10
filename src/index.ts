import 'dotenv/config';
import {Bot, GrammyError, HttpError} from 'grammy';
import * as mongoose from "mongoose";
import {start} from "./commands/index.js";
import {hydrate} from "@grammyjs/hydrate";
import {MyContext} from "./types.js";
import {buyProductById, menu, product, profile, telegramSuccessPayment} from "./callbacks/index.js";

if(!process.env.BOT_TOKEN) {
  throw new Error('Bot token is not defined');
}
const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

bot.on('pre_checkout_query', (ctx: MyContext) => {
  ctx.answerPreCheckoutQuery(true);
});

bot.use(hydrate());

bot.on(':successful_payment', telegramSuccessPayment);

bot.command('start', start);

bot.callbackQuery('menu', menu);

bot.callbackQuery('products', product);

bot.callbackQuery('profile', profile);

bot.callbackQuery(/^buyProduct-\d+$/, buyProductById);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e: unknown = err.error;

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
  } catch (err) {
    console.error('Error in startBot:', err);
  }
}

startBot();
