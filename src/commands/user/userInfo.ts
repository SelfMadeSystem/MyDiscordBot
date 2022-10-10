import { UserMenuCommand } from '../command';
import { EmbedBuilder } from 'discord.js';
import { bot } from '../..';

const command: UserMenuCommand = {
    commandCategory: 'utility',
    help: {
        name: 'User Info',
        description: 'Displays information about the user.',
        usage: 'Right click on a user and hover over  Apps  to see this command.',
    },
    async userMenuCommand(interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId)
            .catch((e) => { throw e; });
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}'s Info`)
            .setThumbnail(member.user.avatarURL())
            .setColor('#1AACA7')
            .addFields({ name: 'ID', value: member.user.id },
                { name: 'Created At', value: member.user.createdAt.toLocaleString() },
                { name: 'Joined At', value: member.joinedAt.toLocaleString() },
                { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') },
                { name: 'Bot', value: member.user.bot ? 'Yes' : 'No' },
                { name: 'Nickname', value: member.nickname ?? "None" })
            .setAuthor({ "name": `Requested by: ${interaction.user.username}`, "iconURL": interaction.user.avatarURL() })
            .setFooter(bot.footer);
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
};

export default command;