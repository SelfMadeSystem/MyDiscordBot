import { MenuCommand } from '../command';
import { ContextMenuInteraction, MessageEmbed } from 'discord.js';

const command: MenuCommand = {
    commandCategory: 'utility',
    help: {
        name: 'User Info',
        description: 'Displays information about the user.',
        usage: 'Right click on a user and hover over  Apps  to see this command.',
    },
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
            .setAuthor({ "name": `Requested by: ${interaction.user.username}`, "iconURL": interaction.user.avatarURL() })
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