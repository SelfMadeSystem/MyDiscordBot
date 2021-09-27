import { SlashCommand } from '../command';
import { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const command: SlashCommand = {
    slashCommandCategory: 'utility',

    slashCommand: async (interaction: CommandInteraction) => {
    },

    discordCommand: new SlashCommandBuilder().setName('help').setDescription('Shows this help message')
}

export default command;