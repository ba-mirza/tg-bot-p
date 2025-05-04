import {InlineKeyboard} from "grammy";

export const Button = {
    menu: new InlineKeyboard().text('Меню', 'menu').row(),
    back: new InlineKeyboard().text('Назад', 'menu').row(),
} as const;

function t(btn: string) {
    return btn;
}

export function ButtonType<T extends string>(btn: T) {
    return new InlineKeyboard().text(t(btn as string), btn).row();
}