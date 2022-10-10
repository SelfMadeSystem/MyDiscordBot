import { SlashCommand, Categories, Command, getAllCommands, getCommandsByCategory } from '../command';
import { InteractionReplyOptions, ButtonInteraction, SelectMenuInteraction, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ChatInputCommandInteraction, CacheType, ModalSubmitInteraction } from 'discord.js';
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v9';
import { randomColor } from '../../utils/utils';
import { bot } from '../..';

function genChoices(): APIApplicationCommandOptionChoice<string>[] {
    const commands = getAllCommands();

    return commands.map(c => {
        let name = getCommandName(c);
        return {
            name,
            value: name
        };
    });
}

function getCommandName(command: Command): string {
    if (command.help) return command.help.name;
    return command.discordCommand.name;
}

const commandDescriptionCache = new Map<Command, EmbedBuilder>();

function getCommandDescription(command: Command): EmbedBuilder {
    if (commandDescriptionCache.has(command)) {
        return commandDescriptionCache.get(command);
    }
    const embed = new EmbedBuilder()
        .setColor(randomColor());
    if (command.help) {
        embed.setTitle(command.help.name);
        embed.setDescription(command.help.description);
        if (command.help.usage) embed.setFooter({ text: command.help.usage });
        if (command.help.examples) embed.addFields({ name: 'Examples', value: command.help.examples.join('\n') });
    } else {
        embed.setTitle(command.discordCommand.name);
        embed.setDescription(command.discordCommand.description);
    }
    commandDescriptionCache.set(command, embed);
    return embed;
}

let _helpGeneric: InteractionReplyOptions = null;

function helpGeneric() {
    if (_helpGeneric) return _helpGeneric;
    const commands = getAllCommands();
    const commandList = commands.map(c => getCommandName(c));
    const commandListEmbed = new EmbedBuilder()
        .setTitle("Command List")
        .setDescription(`Use \`/help [command]\` to get more information about a command.`)
        .setColor("#fff")
        .setFooter(bot.footer);
    for (let cat of Categories) {
        const categoryCommands = getCommandsByCategory(cat);
        if (categoryCommands.length === 0) continue;
        const categoryCommandList = categoryCommands.map(c => getCommandName(c));
        commandListEmbed.addFields({ name: cat.charAt(0).toUpperCase() + cat.slice(1), value: categoryCommandList.join('\n'), inline: true });
    }
    return _helpGeneric = {
        embeds: [commandListEmbed],
        components: [new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setPlaceholder("Select a command for help on it.")
                    .setCustomId("help:generic")
                    .addOptions(commandList.map(c => {
                        return {
                            label: c,
                            value: c
                        };
                    }))
            )],
        ephemeral: true,
    };
}

const command: SlashCommand & { _discordCommand: any; } = {
    commandCategory: 'utility',
    help: {
        name: 'Help',
        description: 'Displays a list of commands and their descriptions.',
        usage: 'help [command]',
        examples: ['/help', '/help ping']
    },

    slashCommand: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const cmdName = interaction.options.getString("command");
        if (cmdName) {
            const command = getAllCommands().find(c =>
                c.help && c.help.name == cmdName ||
                c.discordCommand.name == cmdName);
            if (command) {
                const embed = getCommandDescription(command);
                interaction.reply({
                    ephemeral: true,
                    embeds: [embed]
                });
            } else {
                interaction.reply("Command not found.");
            }
        } else {
            interaction.reply(helpGeneric());
        }
    },

    interact: async (interaction: ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction) => {
        switch (interaction.customId) {
            case "help:generic":
                const cmdName = (interaction as SelectMenuInteraction).values[0];
                if (cmdName) {
                    const command = getAllCommands().find(c =>
                        c.help && c.help.name == cmdName ||
                        c.discordCommand.name == cmdName);
                    if (command) {
                        const embed = getCommandDescription(command);
                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        });
                    } else {
                        interaction.reply({
                            content: "Command not found.",
                            ephemeral: true
                        });
                    }
                } else {
                    interaction.reply(helpGeneric());
                }
                break;
        }
    },

    _discordCommand: null,

    get discordCommand() {
        if (this._discordCommand) return this._discordCommand;
        return this._discordCommand = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Shows this help message')
            .addStringOption(new SlashCommandStringOption()
                .setName('command')
                .setDescription('The command to show help for')
                .setRequired(false)
                .addChoices(...genChoices())
            )
            .toJSON();
    }
};

export default command;