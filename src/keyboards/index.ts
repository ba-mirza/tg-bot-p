import {InlineKeyboard} from "grammy";
import {ButtonEnums} from "../consts/Buttons.js";

// TODO: Переделать роутинг между инлайн кнопками. Объекты Route должны быть функциями
//  которые принимают в качестве аргумента текущий путь откуда он пришел.
//  Всю цепочку пути сохранять в неком routeState, с помощью него реализовать
//  кнопку "Назад" чтобы попасть в предыдущий callbackQuery.
export const Route = {
    Menu: new InlineKeyboard().text('Меню', 'menu').row(),
    MainView: new InlineKeyboard()
        .text('Товары', 'products').row()
        .text('Профиль', 'profile').row(),
    Back: new InlineKeyboard().text('◀️Назад', 'menu').row(),
} as const;

export function generateButtons(btns: unknown) {
    if (!Array.isArray(btns) || btns.length === 0) {
        return Route.Back;
    }

    const keyboard = new InlineKeyboard();

    for (let i = 0; i < btns.length; i += 2) {
        const btn1 = btns[i];
        const btn2 = btns[i + 1];

        keyboard.text(btn1.name, `buyProduct-${btn1.id}`);

        if (btn2) {
            keyboard.text(btn2.name, `buyProduct-${btn2.id}`);
        }

        keyboard.row();
    }

    keyboard.text('🔙 Назад', ButtonEnums.MENU).row();

    return keyboard;
}
