import {InlineKeyboard} from "grammy";

// Start refactoring routes
type Path = string[];

export const Route = {
    routeState: [] as Path,

    Menu: function(path: string) {
        this.routeState.push(path);
        return new InlineKeyboard().text("Меню", path).row();
    },

    MainView: function(path: string) {},

    Back: function(path: string) {}
};