import {Button, generateButtons} from "../keyboards/index.js";
import {CallbackQueryContext} from "grammy";
import {MyContext} from "../types.js";
import {User} from "../models/User.js";
import {products} from "../consts/product.js";

type CbQueryContext = CallbackQueryContext<MyContext>;

export const menu = (ctx: CbQueryContext) => {
    ctx.answerCallbackQuery();

    ctx.callbackQuery.message?.editText(
        "Вы в главном меню!\nВыберите варианты кнопок",
        {reply_markup: Button.MainView}
    )
}

export const product = (ctx: CbQueryContext) => {
    ctx.answerCallbackQuery();

    const productList = products.reduce((acc, cur) => {
        return (
            acc + `${cur.name}\nPrice: ${cur.price}\nDescription: ${cur.description}\n`
        );
    }, '');

    const messageText = `Все товары: \n${productList}`

    ctx.callbackQuery.message?.editText(
        messageText,
        {
            reply_markup: generateButtons(products),
        }
    );
}

export const profile = async (ctx: CbQueryContext) => {
    await ctx.answerCallbackQuery();
    const user = await User.findOne({telegramId: ctx.from.id});
    await ctx.callbackQuery.message?.editText(
        `Ваш профиль:\nID: ${user!.telegramId}\nName: ${user!.username}`,
        {reply_markup: Button.Back}
    );
}