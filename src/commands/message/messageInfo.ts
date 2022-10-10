import { MessageMenuCommand } from '../command';
import { TextChannel, BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { bot } from '../..';

const command: MessageMenuCommand = {
    commandCategory: 'utility',
    help: {
        name: 'Message Info',
        description: 'Get information about a message.',
        usage: 'Right click a message and hover over  Apps  to see this command.'
    },
    async messageMenuCommand(interaction) {
        const channel = interaction.channel as TextChannel;
        const message = await channel.messages.fetch(interaction.targetId)
            .catch((e) => { throw e; });
        const member = await message.guild.members.fetch(message.author.id);
        const embed = new EmbedBuilder()
            .setTitle(`Message Info`)
            .setColor(member.displayColor)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields({ name: `Author`, value: `${member.user.tag} (${member.id})` },
                { name: `Channel`, value: `${channel.name} (${channel.id})` },
                { name: `Content`, value: message.content.length > 0 ? message.content : 'No content' },
                { name: `Timestamp`, value: message.createdAt.toLocaleString() },
                { name: `Attachments`, value: message.attachments.size > 0 ? message.attachments.map(attachment => attachment.proxyURL).join('\n') : 'None' },
                { name: `Embeds`, value: message.embeds.length > 0 ? `${message.embeds.length}` : 'None' },
                { name: `Reactions`, value: message.reactions.cache.size > 0 ? message.reactions.cache.map(reaction => reaction.emoji.name).join('\n') : 'None' },
                { name: `Mentions`, value: message.mentions.users.size > 0 ? message.mentions.users.map(user => user.tag).join('\n') : 'None' },
                { name: `Mentioned Roles`, value: message.mentions.roles.size > 0 ? message.mentions.roles.map(role => role.name).join('\n') : 'None' },
                { name: `Mentioned Channels`, value: message.mentions.channels.size > 0 ? message.mentions.channels.map(channel => (channel as BaseGuildTextChannel).name).join('\n') : 'None' },
                { name: `Mentioned Everyone`, value: message.mentions.everyone ? 'Yes' : 'No' })
            .setFooter(bot.footer);

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
    discordCommand: {
        name: 'Message Info',
        type: 3
    }
};

export default command;