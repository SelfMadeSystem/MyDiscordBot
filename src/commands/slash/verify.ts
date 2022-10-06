import { SlashCommand } from '../command';
import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { bot } from '../..';
import { randomColor } from '../../utils/utils';
import { createHash } from 'crypto';

export const name = 'verify';

const verifiedRole = '607968699428896799';

interface VerifyMath {
    expression: string;
    answer: number;
    hash: string;
}

const operations: [string, (a: number, b: number) => number][] = [
    ['+', (a, b) => a + b],
    ['-', (a, b) => a - b],
    ['×', (a, b) => a * b],
    ['÷', (a, b) => a / b],
];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVerifyMath() {
    const rand = Math.floor(Math.random() * operations.length);
    const [op, func] = operations[rand];

    const { a, b } = (() => {
        switch (rand) {
            case 0:
                return { a: randomInt(1, 100), b: randomInt(1, 100) };
            case 1: {
                const a = randomInt(0, 100);
                const b = randomInt(0, a - 1);
                return { a, b };
            }
            case 2:
                return { a: randomInt(2, 12), b: randomInt(2, 12) };
            case 3: {
                const randomTerms = [
                    randomInt(1, 12),
                    randomInt(1, 12),
                ];
                const a = randomTerms[0] * randomTerms[1];
                const b = randomTerms[randomInt(0, 1)];

                return { a, b };
            }
        }
    })();

    const answer = func(a, b);
    const expression = `${a} ${op} ${b}`;
    const hash = createHash('sha256').update(expression).digest('hex');

    return { expression, answer, hash };
}

const verifies: Map<string, VerifyMath> = new Map();

const command: SlashCommand = {
    commandCategory: 'moderation',

    slashCommand(interaction) {
        if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(verifiedRole)) {
            interaction.reply({
                ephemeral: true,
                embeds: [new EmbedBuilder()
                    .setColor(randomColor())
                    .setTitle('Already verified')
                    .setDescription('You are already verified.')],
            });
            return;
        }
        const verifyMath = generateVerifyMath();
        verifies.set(verifyMath.hash, verifyMath);

        interaction.showModal(new ModalBuilder()
            .setCustomId(`verify:${verifyMath.hash}`)
            .setTitle('Verify')
            .addComponents(new ActionRowBuilder<TextInputBuilder>()
                .addComponents(new TextInputBuilder()
                    .setCustomId('expression')
                    .setLabel(`Please evaluate the equation: ${verifyMath.expression}.`)
                    .setPlaceholder('Expression')
                    .setStyle(TextInputStyle.Short))));
    },

    interact(interaction) {
        if (interaction.isModalSubmit()) {
            const verifyMath = verifies.get(interaction.customId.split('-')[1]);
            if (!verifyMath) return;
            const answer = interaction.fields.getTextInputValue('expression');
            if (answer === '') return;
            if (parseInt(answer) === verifyMath.answer) {
                interaction.reply({
                    ephemeral: true,
                    embeds: [new EmbedBuilder()
                        .setTitle('Verified')
                        .setColor("#00ff00")
                        .setDescription('You have been verified. Adding you to the verified list.')],
                }).then(() => {
                    const member = interaction.guild.members.
                        cache.get(interaction.user.id);
                    if (!member) return;
                    member.roles.add(verifiedRole);
                });
            } else {
                interaction.reply({
                    ephemeral: true,
                    embeds: [new EmbedBuilder()
                        .setTitle('Incorrect')
                        .setDescription('Please use /verify again.')
                        .addFields([{
                            name: 'Expression',
                            value: verifyMath.expression,
                            inline: true,
                        }, {
                            name: 'Answer',
                            value: verifyMath.answer.toString(),
                            inline: true,
                        }])
                        .setColor(randomColor()),
                    ],
                });
            }
            verifies.delete(verifyMath.hash);
        }
    },

    help: {
        name,
        description: "Verify you're not a bot.",
        usage: "/verify",
        examples: [
            "/verify"
        ]
    },

    discordCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription("Verify you're not a bot.")
        .toJSON()
}

export default command;