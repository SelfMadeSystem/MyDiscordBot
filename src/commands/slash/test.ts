import { SlashCommand } from '../command';
import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { bot } from '../..';

export const name = 'test';

const command: SlashCommand = {
    interactionIds: ['server_primary', 'server_secondary', 'server_tertiary', 'test_modal'],

    commandCategory: 'misc',

    slashCommand(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('test_modal')
            .setTitle('My Modal');

        // Add components to modal

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("What's some of your favorite hobbies?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        interaction.showModal(modal);
    },

    interact(interaction) {
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
        } else if (interaction.isModalSubmit()) {
            const favColor = interaction.fields.getTextInputValue('favoriteColorInput');
            const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
            interaction.reply({
                content: "hi",
                ephemeral: true,
                embeds: [new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Some title')
                    .setURL('https://discord.js.org/')
                    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                    .setDescription('Some description here')
                    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                    .addFields(
                        { name: 'Regular field title', value: 'Some value here' },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Your favorite color is:', value: favColor, inline: true },
                        { name: 'Your hobbies are:', value: hobbies, inline: true },
                    )
                    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                    .setImage('https://i.imgur.com/AfFp7pu.png')
                    .setTimestamp()
                    .setFooter(bot.footer)],
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
                                    label: 'Or you can select me too',
                                    description: 'This is a description as well',
                                    value: '3',
                                },
                                {
                                    label: 'I can be selected too',
                                    description: '...you guessed it, a description',
                                    value: '4',
                                },
                                {
                                    label: 'Guess what?',
                                    description: 'I can be selected! Oh, and this is a description',
                                    value: '5',
                                },
                                {
                                    label: 'Well, what do you know.',
                                    description: 'Oh right! You can select me! And mustn\'t forget, this is a description',
                                    value: '6'
                                },
                            ])
                    )]
            })
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