import { Command } from '../command';
import { ContextMenuInteraction, MessageEmbed } from 'discord.js'

const command: Command = {
    name: 'User Info',
    async menuCommand(interaction: ContextMenuInteraction) {
        const member = await interaction.guild.members.fetch(interaction.targetId)
            .catch((e) => { throw e });
        const embed = new MessageEmbed()
            .setTitle(`${member.user.username}'s Info`)
            .setThumbnail(member.user.avatarURL())
            .setColor('#1AACA7')
            .addField('ID', member.user.id)
            .addField('Created At', member.user.createdAt.toLocaleString())
            .addField('Joined At', member.joinedAt.toLocaleString())
            .addField('Roles', member.roles.cache.map(r => r.name).join(', '))
            .addField('Bot', member.user.bot ? 'Yes' : 'No')
            .addField('Nickname', member.nickname ?? "None")
            .setAuthor(`Requested by: ${interaction.user.username}`, interaction.user.avatarURL())
        interaction.reply({
            // content: `${member} ${interaction.targetId}`,
            ephemeral: true,
            embeds: [embed]
        });
    },
    discordCommand: {
        name: 'User Info',
        type: 2
    }
}

export default command;