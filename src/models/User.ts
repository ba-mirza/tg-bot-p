import {Document, Schema, model} from "mongoose"

export interface IUser extends Document {
    telegramId: number,
    firstname: string,
    username: string,
    createdAt: Date,
}

const userSchema = new Schema({
    telegramId: {
        type: Number,
        required: [true, "Telegram ID is required"],
        unique: true,
    },
    firstname: {
        type: String,
    },
    username: {
        type: String,
    },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);