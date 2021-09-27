import { MenuCommand } from '../command';
import { ContextMenuInteraction, MessageEmbed, TextChannel, BaseGuildTextChannel } from 'discord.js'

const command: MenuCommand = {
    async menuCommand(interaction: ContextMenuInteraction) {
        const channel = interaction.channel as TextChannel;
        const message = await channel.messages.fetch(interaction.targetId)
            .catch((e) => { throw e });
        const member = await message.guild.members.fetch(message.author.id);
        const embed = new MessageEmbed()
            .setTitle(`Message Info`)
            .setColor(member.displayColor)
            .setThumbnail(member.user.displayAvatarURL())
            .addField(`Author`, `${member.user.tag} (${member.id})`)
            .addField(`Channel`, `${channel.name} (${channel.id})`)
            .addField(`Content`, message.content.length > 0 ? message.content : 'No content')
            .addField(`Timestamp`, message.createdAt.toLocaleString())
            .addField(`Attachments`, message.attachments.size > 0 ? message.attachments.map(attachment => attachment.proxyURL).join('\n') : 'None')
            .addField(`Embeds`, message.embeds.length > 0 ? `${message.embeds.length}` : 'None')
            .addField(`Reactions`, message.reactions.cache.size > 0 ? message.reactions.cache.map(reaction => reaction.emoji.name).join('\n') : 'None')
            .addField(`Mentions`, message.mentions.users.size > 0 ? message.mentions.users.map(user => user.tag).join('\n') : 'None')
            .addField(`Mentioned Roles`, message.mentions.roles.size > 0 ? message.mentions.roles.map(role => role.name).join('\n') : 'None')
            .addField(`Mentioned Channels`, message.mentions.channels.size > 0 ? message.mentions.channels.map(channel => (channel as BaseGuildTextChannel).name).join('\n') : 'None')
            .addField(`Mentioned Everyone`, message.mentions.everyone ? 'Yes' : 'No')

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    },
    discordCommand: {
        name: 'Message Info',
        type: 3
    }
}

export default command;