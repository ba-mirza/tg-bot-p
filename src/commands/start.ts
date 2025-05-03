import {InlineKeyboard} from "grammy";
import {User} from "../models/User.js";
import {MyContext} from "../types.js";

export const start = async (ctx: MyContext) => {
    if(!ctx.from) {
        return ctx.reply("User info is not available");
    }

    const {id, first_name, username} = ctx.from;

    try {
        const keyboard = new InlineKeyboard().text('Меню', 'menu').row();

        const existingUser = await User.findOne({telegramId: id});
        if (existingUser) {
            return ctx.reply(
                "You already registered!",
                {reply_markup: keyboard,}
            );
        }

        const newUser = await User.create({
            telegramId: id,
            firstName: first_name,
            username: username,
        })
        await newUser.save();

        ctx.reply("You successfully registered!", {reply_markup: keyboard,});
    } catch (err) {
        console.error("[register]: Something went wrong", err);
        ctx.reply("Something went wrong! Try again later!");
    }
}