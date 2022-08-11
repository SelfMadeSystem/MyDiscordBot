import { SlashCommand } from '../command';
import { ChatInputCommandInteraction, ButtonInteraction, SelectMenuInteraction, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, CacheType } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const name = 'test';

const command: SlashCommand = {
    interactionIds: ['server_primary', 'server_secondary', 'server_tertiary'],

    commandCategory: 'misc',

    slashCommand(interaction: ChatInputCommandInteraction<CacheType>): void {
        interaction.reply({
            content: "hi",
            ephemeral: true,
            // embeds: [new EmbedBuilder()
            //     .setColor(0x0099FF)
            //     .setTitle('Some title')
            //     .setURL('https://discord.js.org/')
            //     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            //     .setDescription('Some description here')
            //     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            //     .addFields(
            //         { name: 'Regular field title', value: 'Some value here' },
            //         { name: '\u200B', value: '\u200B' },
            //         { name: 'Inline field title', value: 'Some value here', inline: true },
            //         { name: 'Inline field title', value: 'Some value here', inline: true },
            //     )
            //     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //     .setImage('https://i.imgur.com/AfFp7pu.png')
            //     .setTimestamp()
            //     .setFooter(bot.footer)],
            components: [new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('server_primary')
                        .setLabel('Primary')
                        .setStyle(1),
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('server_secondary')
                        .setLabel('Secondary')
                        .setStyle(2),
                ),
            new ActionRowBuilder<SelectMenuBuilder>()
                .addComponents(
                    new SelectMenuBuilder()
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

    help: {
        name: "Test",
        description: "Description for the test command.",
        usage: "/test",
        examples: [
            "/test"
        ]
    },

    discordCommand: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command.')
        .toJSON()
}

export default command;