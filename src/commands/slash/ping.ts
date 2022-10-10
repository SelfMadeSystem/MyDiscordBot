import { SlashCommand } from '../command';
import { EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { randomColor } from '../../utils/utils';
import { bot } from '../..';

const command: SlashCommand = {
    commandCategory: 'misc',

    slashCommand(interaction): void {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pong!')
                    .setDescription(`${interaction.member.user.username} pong!`)
                    .addFields({
                        name: 'Ping',
                        value: `${Date.now() - interaction.createdTimestamp}ms`
                    })
                    .setColor(randomColor())
                    .setFooter(bot.footer),
            ]
        });
    },

    discordCommand: new SlashCommandBuilder().setName('ping').setDescription('Sends pong with the milliseconds delay.').toJSON()
};

export default command;