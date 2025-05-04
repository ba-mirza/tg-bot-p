import {InlineKeyboard} from "grammy";

export const Button = {
    Menu: new InlineKeyboard().text('Меню', 'menu').row(),
    MainView: new InlineKeyboard()
        .text('Товары', 'products').row()
        .text('Профиль', 'profile').row(),
    Back: new InlineKeyboard().text('◀️Назад', 'menu').row(),
} as const;

function t(btn: string) {
    return btn;
}

export function ButtonType<T extends string>(btn: T) {
    return new InlineKeyboard().text(t(btn as string), btn).row();
}

export function generateButtons(btns: unknown) {
    if (typeof btns !== "undefined" && Array.isArray(btns)) {
        if (!btns.length) {
            return Button.Back;
        }
        const keyboard = new InlineKeyboard();
        for (const btn of btns) {
            keyboard.text(btn.price, btn.name).row();
        }
        const backButton = Button.Back.inline_keyboard[0][0];
        keyboard.text(backButton.text, 'menu').row();
        return keyboard;
    }
    return Button.Back;
}