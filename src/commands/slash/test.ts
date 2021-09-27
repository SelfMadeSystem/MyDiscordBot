import { SlashCommand } from '../command';
import { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, ButtonInteraction, SelectMenuInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const name = 'test';

const command: SlashCommand = {
    interactionIds: ['server_primary', 'server_secondary', 'server_tertiary'],

    slashCommandCategory: 'misc',

    slashCommand(interaction: CommandInteraction): void {
        interaction.reply({
            content: "hi",
            ephemeral: true,
            /* embeds: [new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addField('Inline field title', 'Some value here', true)
                .setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png')], */
            components: [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('server_primary')
                        .setLabel('Primary')
                        .setStyle('PRIMARY'),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('server_secondary')
                        .setLabel('Secondary')
                        .setStyle('SECONDARY'),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('server_tertiary')
                        .setMinValues(1)
                        .setMaxValues(3)
                        .setPlaceholder('Select an option')
                        .addOptions([
                            {
                                label: 'Select me',
                                description: 'This is a description',
                                value: '1',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: '2',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: '3',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: '4',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: '5',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: '6',
                            },

                        ])
                )]
        })
    },

    interact(interaction: ButtonInteraction | SelectMenuInteraction) {
        if (interaction.isButton()) {
            interaction.reply({
                content: interaction.customId,
                ephemeral: true,
            });
        } else if (interaction.isSelectMenu()) {
            interaction.reply({
                content: interaction.values.join(', '),
                ephemeral: true,
            });
        }
    },

    discordCommand: new SlashCommandBuilder().setName('test').setDescription('Test command.').toJSON()
}

export default command;