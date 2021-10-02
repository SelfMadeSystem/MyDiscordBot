import { Bot } from '../bot';
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, Snowflake } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';
import fs from 'fs';

// A list of command categories.
export type CommandCategory = 'admin' | 'fun' | 'moderation' | 'utility' | 'music' | 'misc';
export const Categories: CommandCategory[] = ['admin', 'fun', 'moderation', 'utility', 'music', 'misc']

/**
 * The command manager.
 * You don't need to use this class directly; use the `Command` class instead.
 */
export class CommandManager {
    // List of all commands.
    private commands: Command[] = [];
    // List of only slash commands.
    private slashCommands: Command[] = [];
    // List of only menu commands.
    private menuCommands: Command[] = [];

    constructor(private bot: Bot) {
        this.slashCommands = getCommands("slash"); // Get all slash commands.
        this.menuCommands = getCommands("menu"); // Get all menu commands.
        this.commands = [...this.slashCommands, ...this.menuCommands]; // Combine both lists.
        this.hook(); // Hook the interaction events.
    }

    /**
     * Executes a slash command.
     * 
     * @param command The command to execute.
     * @param interaction The interaction to execute the command on.
     */
    public slash(command: string, interaction: CommandInteraction): void {
        // Get the command.
        const commandToExecute = this.slashCommands.find(
            (c) => c.discordCommand.name === command
        );

        if (commandToExecute) {
            // Execute the command if it exists.
            commandToExecute?.slashCommand(interaction);
        } else {
            // Otherwise, send a message to the user and log the error.
            interaction.reply({
                content: `I'm sorry. Command ${command} not found.`,
                ephemeral: true,
            });
            console.warn(`Slash command ${command} not found`);
        }
    }

    /**
     * Executes a menu command.
     * 
     * @param command The command to execute.
     * @param interaction The interaction to execute the command on.
     */
    public menu(command: string, interaction: ContextMenuInteraction): void {
        // Get the command.
        const commandToExecute = this.menuCommands.find(
            (c) => c.discordCommand.name === command
        );

        if (commandToExecute) {
            // Execute the command if it exists.
            commandToExecute?.menuCommand(interaction);
        } else {
            // Otherwise, send a message to the user and log the error.
            interaction.reply({
                content: `I'm sorry. Command ${command} not found.`,
                ephemeral: true,
            });
            console.warn(`Menu command ${command} not found`);
        }
    }

    /**
     * Executes a user interaction (button, select menu, etc).
     * 
     * @param id The id of the interaction.
     * @param interaction The interaction to execute.
     */
    public interact(id: string, interaction: ButtonInteraction | SelectMenuInteraction) {
        // Get the command.
        const command = this.commands.find(
            (c) => c.interactionIds?.includes(id)
        );

        if (command) {
            // Execute the command if it exists.
            command?.interact(interaction);
        } else {
            // Otherwise, send a message to the user and log the error.
            interaction.reply({
                content: `I'm sorry. Interaction ${command} not found.`,
                ephemeral: true,
            });
            console.warn(`Interaction ${id} not found`);
        }
    }

    private hook() {
        this.bot.getClient().on('interactionCreate', async interaction => {
            if (interaction.isCommand()) {
                const { commandName } = interaction;

                this.slash(commandName, interaction);
            } else if (interaction.isContextMenu()) {
                const { commandName } = interaction;

                this.menu(commandName, interaction);
            } else if (interaction.isButton() || interaction.isSelectMenu()) {
                const { customId } = interaction;

                this.interact(customId, interaction);
            } else {
                console.warn(`Unknown interaction type ${interaction.type}`);
            }
        });
    }
}

/**
 * The base command interface.
 * Don't use this class directly; use either the `SlashCommand` or the `MenuCommand` class instead.
 * 
 * See examples in the `slash` and `menu` folders.
 */
export interface Command {
    // The command object that will be sent to Discord.
    // This is the same object that is used to register the command.
    discordCommand: any;
    help?: {
        name: string;
        description: string;
        usage?: string;
        examples?: string[];
    };
    // The category of the command.
    commandCategory: CommandCategory;
    // Optional list of interaction ids (for buttons, select menus, etc).
    interactionIds?: string[];
    // The function to execute when the command is executed.
    slashCommand?: (interaction: CommandInteraction) => void;
    // The function to execute when the command is executed.
    menuCommand?: (interaction: ContextMenuInteraction) => void;
    // The function to execute when the command is interacted with.
    interact?: (interaction: ButtonInteraction | SelectMenuInteraction) => void;
}

// Used for slash commands.
export interface SlashCommand extends Command {
    slashCommand: (interaction: CommandInteraction) => void;
}

// Used for menu commands.
export interface MenuCommand extends Command {
    help: {
        name: string;
        description: string;
        usage?: string;
        examples?: string[];
    };
    menuCommand: (interaction: ContextMenuInteraction) => void;
}

export function getDiscordCommands(): any[] {
    return getAllCommands().map(c => c.discordCommand);
}

const commands = getCommands("slash").concat(getCommands("menu"));

export function getCommandsByCategory(category: CommandCategory): Command[] {
    return commands.filter(c => c.commandCategory === category);
}

export function getAllCommands(): Command[] {
    return commands;
}

export function getCommands(dir: "slash" | "menu"): Command[] {
    const files = fs.readdirSync(path.join(__dirname, `./${dir}`));
    const commands = files.map(file => {
        return require(`./${dir}/${file}`).default;
    });
    return commands;
}