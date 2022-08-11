import { Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { Bot } from "../bot";

export interface ReactionRole {
    emoji: string;
    role: string;
    permanent?: boolean;
}

export class ReactionRoleManager {
    private messageHandlers: Map<[string, string], ReactionRole[]> = new Map<[string, string], ReactionRole[]>([
        [ //  Channel ID,           Message ID
            ['481601462229794836', '1007127459566731314'], [
                { emoji: '🤔', role: '481549084499640341' },
                { emoji: '932468812496896001', role: '607968885005746189', permanent: true },
            ]
        ]
    ]);
    private messageHandlersByMessage: Map<string, ReactionRole[]> = new Map<string, ReactionRole[]>();

    constructor(private bot: Bot) {
        bot.client.on('messageReactionAdd', this.onReactionAdd.bind(this));
        bot.client.on('messageReactionRemove', this.onReactionRemove.bind(this));

        this.messageHandlers.forEach(async (handlers, [channelID, messageID]) => {
            this.messageHandlersByMessage.set(messageID, handlers);

            const channel = await bot.client.channels.fetch(channelID);
            if (channel && channel.isTextBased()) {
                const message = await channel.messages.fetch(messageID);
                if (message) {
                    handlers.forEach(handler => {
                        if (!message.reactions.cache.has(handler.emoji)) {
                            message.react(handler.emoji);
                        }
                    });
                }
            }
        });
    }

    private onReactionAdd(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        const message = reaction.message as Message;
        const messageId = message.id;
        const emojiId = reaction.emoji.id;
        const emojiName = reaction.emoji.name;

        if (this.messageHandlersByMessage.has(messageId)) {
            const handlers = this.messageHandlersByMessage.get(messageId);
            const handler = handlers.find(h => h.emoji === emojiName || h.emoji === emojiId);

            if (handler) {
                const member = message.guild.members.cache.get(user.id);
                if (member) {
                    member.roles.add(handler.role);
                }
            }
        }
    }

    private onReactionRemove(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        const message = reaction.message as Message;
        const messageId = message.id;
        const emojiId = reaction.emoji.id;
        const emojiName = reaction.emoji.name;

        if (this.messageHandlersByMessage.has(messageId)) {
            const handlers = this.messageHandlersByMessage.get(messageId);
            const handler = handlers.find(h => h.emoji === emojiName || h.emoji === emojiId);

            if (handler && !handler.permanent) {
                const member = message.guild.members.cache.get(user.id);
                if (member) {
                    member.roles.remove(handler.role);
                }
            }
        }
    }
}
