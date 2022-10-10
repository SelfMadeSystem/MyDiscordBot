import { SlashCommand } from '../command';
import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { bot } from '../..';

export const name = 'test';

const bunchOfStuff: SlashCommand = {
    commandCategory: 'misc',

    slashCommand(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('test:modal')
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
                            .setCustomId('test:primary')
                            .setLabel('Primary')
                            .setStyle(1),
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('test:secondary')
                            .setLabel('Secondary')
                            .setStyle(2),
                    ),
                new ActionRowBuilder<SelectMenuBuilder>()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('test:tertiary')
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

const ephemeral: { ephemeral?: boolean } = {
};

const paginationPage1: InteractionReplyOptions = {
    content: "Page 1",
    components: [new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test:page2')
                .setLabel('Page 2')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page3')
                .setLabel('Page 3')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page4')
                .setLabel('Page 4')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page2:next') // add the `:prev` to avoid duplicate custom ids
                .setLabel('Next')
                .setStyle(1),
        )],
    ...ephemeral
};

const paginationPage2: InteractionReplyOptions = {
    content: "Page 2",
    components: [new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test:page1')
                .setLabel('Page 1')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page3')
                .setLabel('Page 3')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page4')
                .setLabel('Page 4')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page1:prev')
                .setLabel('Previous')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page3:next')
                .setLabel('Next')
                .setStyle(1),
        )],
    ...ephemeral
};

const paginationPage3: InteractionReplyOptions = {
    content: "Page 3",
    components: [new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test:page1')
                .setLabel('Page 1')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page2')
                .setLabel('Page 2')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page4')
                .setLabel('Page 4')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page2:prev')
                .setLabel('Previous')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page4:next')
                .setLabel('Next')
                .setStyle(1),
        )],
    ...ephemeral
};

const paginationPage4: InteractionReplyOptions = {
    content: "Page 4",
    components: [new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test:page1')
                .setLabel('Page 1')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page2')
                .setLabel('Page 2')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page3')
                .setLabel('Page 3')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('test:page3:prev')
                .setLabel('Previous')
                .setStyle(1),
        )],
    ...ephemeral
};

const paginationPages = new Map<string, InteractionReplyOptions>();
paginationPages.set('page1', paginationPage1);
paginationPages.set('page2', paginationPage2);
paginationPages.set('page3', paginationPage3);
paginationPages.set('page4', paginationPage4);

const paginationTest: SlashCommand = {
    commandCategory: "misc",
    help: {
        name: "Test",
        description: "Description for the test command.",
        usage: "/test <page>",
        examples: [
            "/test",
            "/test 2",
        ]
    },

    discordCommand: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command.')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('The page to go to.')
                .setRequired(false))
        .toJSON(),

    slashCommand(interaction) {
        const page = interaction.options.getInteger('page') || 1;
        const pageKey = `page${page}`;
        if (paginationPages.has(pageKey)) {
            interaction.reply(paginationPages.get(pageKey));
        } else {
            interaction.reply({ content: `Page ${page} does not exist.`, ephemeral: true });
        }
    },

    interact(interaction) {
        const customId = interaction.customId.split(':')[1];
        const page = paginationPages.get(customId);
        if (page) {
            if (ephemeral.ephemeral) {
                interaction.reply(page);
            } else {
                const { content, components, embeds, files, attachments } = page;
                interaction.message.edit({
                    content,
                    components,
                    embeds,
                    files,
                    attachments
                })
                interaction.deferUpdate();
            }
        }
    },
}

const anotherTest: SlashCommand = {
    commandCategory: "misc",
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
        .toJSON(),

    async slashCommand(interaction) {
        const roleId = '481549084499640341';

        let message = "Users:";

        await interaction.guild.members.fetch();
        const role = await interaction.guild.roles.fetch(roleId);
        if (role) {
            role.members.forEach(member => {
                console.log(member.user.tag);
                message += `\n${member.user.tag}`;
            });
        }

        interaction.reply({ content: message, ephemeral: true });
    }
}

export default anotherTest;