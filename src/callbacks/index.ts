import {Route, generateButtons} from "../keyboards/index.js";
import {CallbackQueryContext} from "grammy";
import {MyContext} from "../types.js";
import {User} from "../models/User.js";
import {products} from "../consts/product.js";

type CbQueryContext = CallbackQueryContext<MyContext>;

export const menu = (ctx: CbQueryContext) => {
    ctx.answerCallbackQuery();

    ctx.callbackQuery.message?.editText(
        "Вы в главном меню!\nВыберите варианты кнопок",
        {reply_markup: Route.MainView}
    )
}

export const product = (ctx: CbQueryContext) => {
    ctx.answerCallbackQuery();

    const productList = products.reduce((acc, cur) => {
        return (
            acc + `Наименование: ${cur.name}\nPrice: ${cur.price}тенге\nDescription: ${cur.description}\n\n`
        );
    }, '');

    const messageText = `Все товары: \n${productList}`

    ctx.callbackQuery.message?.editText(
        messageText,
        {reply_markup: generateButtons(products),}
    );
}

export const profile = async (ctx: CbQueryContext) => {
    await ctx.answerCallbackQuery();
    const user = await User.findOne({telegramId: ctx.from.id});
    await ctx.callbackQuery.message?.editText(
        `Ваш профиль:\nID: ${user!.telegramId}\nName: ${user!.username}`,
        {reply_markup: Route.Back}
    );
}

export const buyProductById = (ctx: CbQueryContext) => {
    ctx.answerCallbackQuery();
    const productId = ctx.callbackQuery.data.split('-')[1];
    const product = products.find((product) => product.id === +productId);
    console.log(ctx.callbackQuery.data);

    if(!product) {
        return ctx.callbackQuery.message?.editText("Продукт почему-то не найден...")
    }

    ctx.callbackQuery.message?.editText(
        `Вы выбрали: ${product.name}\nЦена: ${product.price}\n\nЖелаете продолжить покупку?`,
        {reply_markup: Route.Back}
    );
}