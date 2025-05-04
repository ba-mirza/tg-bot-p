import {User} from "../models/User.js";
import {MyContext} from "../types.js";
import {Button} from "../keyboards/index.js";

export const start = async (ctx: MyContext) => {
    if(!ctx.from) {
        return ctx.reply("User info is not available");
    }

    const {id, first_name, username} = ctx.from;

    try {
        const existingUser = await User.findOne({telegramId: id});
        if (existingUser) {
            return ctx.reply(
                "You already registered!",
                {reply_markup: Button.Menu}
            );
        }

        const newUser = await User.create({
            telegramId: id,
            firstName: first_name,
            username: username,
        })
        await newUser.save();

        await ctx.reply(
            "You successfully registered!",
            {reply_markup: Button.Menu}
        );
    } catch (err) {
        console.error("[register]: Something went wrong", err);
        await ctx.reply("Something went wrong! Try again later!");
    }
}