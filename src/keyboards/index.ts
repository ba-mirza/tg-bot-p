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

function t(btn: string) {
    return btn;
}

export function ButtonType<T extends string>(btn: T) {
    return new InlineKeyboard().text(t(btn as string), btn).row();
}

export function generateButtons(btns: unknown) {
    if (typeof btns !== "undefined" && Array.isArray(btns)) {
        if (!btns.length) {
            return Route.Back;
        }

        const productsButtonRows = btns.map((btn) => {
            return InlineKeyboard.text(btn.name, `buyProduct-${btn.id}`);
        });

        const newKeyboard = InlineKeyboard.from([
            productsButtonRows,
            [InlineKeyboard.text('Назад', ButtonEnums.MENU)]
        ])

        return newKeyboard;
    }
    return Route.Back;
}