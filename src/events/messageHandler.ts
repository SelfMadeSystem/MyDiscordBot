import { Message } from "discord.js";
import { Bot } from "../bot";
import path from 'path';
import fs from 'fs';

export class MessageHandlerManager {
    private messageHandlers: Handler[] = [];
    private botMessageHandlers: Handler[] = [];
    constructor(private bot: Bot) {
        bot.client.on('messageCreate', this.onMessage.bind(this));
        this.messageHandlers = getHandlers();
        this.botMessageHandlers = this.messageHandlers.filter(h => h.handlesBots === true);
    }

    private onMessage(message: Message) {
        if (message.author.bot) {
            this.botMessageHandlers.forEach(h => h.onMessage(message));
            return;
        }
        this.messageHandlers.forEach(h => h.onMessage(message));
    }
}

export interface Handler {
    onMessage(message: Message): void;
    handlesBots?: boolean;
}

function getHandlers(dir = "message"): Handler[] {
    const files = fs.readdirSync(path.join(__dirname, `./${dir}`));
    const handlers = files.map(file => {
        return require(`./${dir}/${file}`).default;
    });
    return handlers.filter(h => h !== undefined);
}