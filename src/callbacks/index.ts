import 'dotenv/config';
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
            acc + `Чай: ${cur.name}\nЦена: ${cur.price}тенге\nОписание: ${cur.description}\n\n`
        );
    }, '');

    const messageText = `Меню чая: \n\n${productList}`

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

    if(!product) {
        return ctx.callbackQuery.message?.editText("Продукт почему-то не найден...")
    }

    try {
        const chatId = ctx.from.id;
        if(!chatId) {
            throw new Error("Chat ID is not found");
        }

        const providerInvoiceData = {
            receipt: {
                items: [
                    {
                        description: product.description,
                        quantity: 1,
                        amount: {
                            value: `${product.price}.00`,
                            currency: "KZT"
                        },
                        vat_code: 1,
                    },
                ]
            }
        }

        ctx.api.sendInvoice(
            chatId,
            product.name,
            product.description,
            product.toString(),
            'UAH',
            [
                {label: 'Гривен', amount: product.price * 100,}
            ],
            {
                provider_token: process.env.PAYMENT_TOKEN,
                need_email: true,
                send_email_to_provider: true,
                provider_data: JSON.stringify(providerInvoiceData),
            }
        )
    } catch (err) {
        console.error('Error in payment', err)
        ctx.reply('Произошла ошибка при оплате\nПожалуйста, напишите сюда: @SupportBot');
    }
};

export const telegramSuccessPayment = async (ctx: MyContext) => {
    console.log("Sending telegram success payment\n", ctx.message?.successful_payment);
    ctx.reply(
        'Оплата прошла успешна',
        {reply_markup: Route.Menu}
    );
}