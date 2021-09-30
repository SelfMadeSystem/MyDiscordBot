import { SlashCommand, Categories, Command, getAllCommands, getCommandsByCategory } from '../command';
import { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, ColorResolvable } from 'discord.js';
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';

function genChoices(): [string, string][] {
    const commands = getAllCommands()

    return commands.map(c => {
        let name = getCommandName(c)
        return [name, name]
    })
}

function getCommandName(command: Command): string {
    if (command.help) return command.help.name
    return command.discordCommand.name
}

function randomColor(): ColorResolvable {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

function getCommandDescription(command: Command): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor(randomColor())
    if (command.help) {
        embed.setTitle(command.help.name)
        embed.setDescription(command.help.description)
        if (command.help.usage) embed.setFooter(command.help.usage)
        if (command.help.examples) embed.addField('Examples', command.help.examples.join('\n'))
    } else {
        embed.setTitle(command.discordCommand.name)
        embed.setDescription(command.discordCommand.description)
    }
    return embed
}

const command: SlashCommand & { _discordCommand: any, _helpGeneric: MessageEmbed, helpGeneric: MessageEmbed } = {
    commandCategory: 'utility',
    help: {
        name: 'Help',
        description: 'Displays a list of commands and their descriptions.',
        usage: 'help [command] [...]',
        examples: ['/help', '/help ping']
    },

    _helpGeneric: null,

    get helpGeneric() {
        if (this._helpGeneric) return this._helpGeneric;
        const commands = getAllCommands()
        const commandList = commands.map(c => getCommandName(c))
        const commandListEmbed = new MessageEmbed()
            .setTitle("Command List")
            .setDescription(`Use \`/help [command]\` to get more information about a command.`)
            .setFooter(`EEE v5`)
            .setColor("#fff")
        for (let cat of Categories) {
            const categoryCommands = getCommandsByCategory(cat)
            if (categoryCommands.length === 0) continue
            const categoryCommandList = categoryCommands.map(c => getCommandName(c))
            commandListEmbed.addField(cat.charAt(0).toUpperCase() + cat.slice(1), categoryCommandList.join('\n'))
        }
        return this._helpGeneric = commandListEmbed
    },

    slashCommand: async (interaction: CommandInteraction) => {
        const cmdName = interaction.options.getString("command");
        if (cmdName) {
            const command = getAllCommands().find(c => c.help && c.help.name == cmdName || c.discordCommand.name == cmdName)
            if (command) {
                const embed = getCommandDescription(command)
                interaction.reply({ 
                    ephemeral: true,
                    embeds: [embed]
                })
            } else {
                interaction.reply("Command not found.")
            }
        } else {
            const embed = command.helpGeneric
            interaction.reply({
                ephemeral: true,
                embeds: [embed]
            })
        }
    },

    _discordCommand: null,

    get discordCommand() {
        if (this._discordCommand) return this._discordCommand
        return this._discordCommand = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Shows this help message')
            .addStringOption(new SlashCommandStringOption()
                .setName('command')
                .setDescription('The command to show help for')
                .setRequired(false)
                .addChoices(genChoices())
            )
            .toJSON()
    }
}

export default command;