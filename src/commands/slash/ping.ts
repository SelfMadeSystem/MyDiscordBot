import { SlashCommand } from '../command';
import { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { randomColor } from '../../utils/utils';

const command: SlashCommand = {
    commandCategory: 'misc',

    slashCommand(interaction: CommandInteraction): void {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Pong!')
                    .setDescription(`${interaction.member.user.username} pong!`)
                    .addField('Ping', `${Date.now() - interaction.createdTimestamp}ms`)
                    .setColor(randomColor()),
            ]
        })
    },

    discordCommand: new SlashCommandBuilder().setName('ping').setDescription('Sends pong with the milliseconds delay.').toJSON()
}

export default command;