import { Bot } from '../bot';
import { ButtonInteraction, CacheType, ChatInputCommandInteraction, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
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
    // List of only user menu commands.
    private userMenuCommands: Command[] = [];
    // List of only message menu commands.
    private messageMenuCommands: Command[] = [];

    constructor(private bot: Bot) {
        this.slashCommands = getCommands("slash"); // Get all slash commands.
        this.userMenuCommands = getCommands("user"); // Get all user menu commands.
        this.messageMenuCommands = getCommands("message"); // Get all message menu commands.
        this.commands = [...this.slashCommands, ...this.userMenuCommands, ...this.messageMenuCommands]; // Combine all commands.
        this.hook(); // Hook the interaction events.
    }

    /**
     * Executes a slash command.
     * 
     * @param command The command to execute.
     * @param interaction The interaction to execute the command on.
     */
    public slash(command: string, interaction: ChatInputCommandInteraction<CacheType>): void {
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
     * Executes a user menu command.
     * 
     * @param command The command to execute.
     * @param interaction The interaction to execute the command on.
     */
    public userMenu(command: string, interaction: UserContextMenuCommandInteraction<CacheType>): void {
        // Get the command.
        const commandToExecute = this.userMenuCommands.find(
            (c) => c.discordCommand.name === command
        );

        if (commandToExecute) {
            // Execute the command if it exists.
            commandToExecute.userMenuCommand(interaction);
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
     * Executes a message menu command.
     * 
     * @param command The command to execute.
     * @param interaction The interaction to execute the command on.
     */
    public messageMenu(command: string, interaction: MessageContextMenuCommandInteraction<CacheType>): void {
        // Get the command.
        const commandToExecute = this.messageMenuCommands.find(
            (c) => c.discordCommand.name === command
        );

        if (commandToExecute) {
            // Execute the command if it exists.
            commandToExecute.messageMenuCommand(interaction);
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
    public interact(id: string, interaction: ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction) {
        // Split the id into by ":" to get the command name.
        const [commandName] = id.split(":");

        // Get the command.
        const command = this.commands.find(c => c.discordCommand.name === commandName);

        if (command) {
            // Execute the command if it exists.
            command?.interact(interaction);
        } else {
            // Otherwise, send a message to the user and log the error.
            interaction.reply({
                content: `I'm sorry. Interaction ${commandName} not found.`,
                ephemeral: true,
            });
            console.warn(`Interaction ${id} not found`);
        }
    }

    private hook() {
        this.bot.client.on('interactionCreate', async interaction => {
            if (interaction.isChatInputCommand()) {
                const { commandName } = interaction;

                this.slash(commandName, interaction);
            } else if (interaction.isUserContextMenuCommand()) {
                const { commandName } = interaction;

                this.userMenu(commandName, interaction);

            } else if (interaction.isMessageContextMenuCommand()) {
                const { commandName } = interaction;

                this.messageMenu(commandName, interaction);
            } else if (interaction.isButton() || interaction.isSelectMenu() || interaction.isModalSubmit()) {
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
    // The function to execute when the slash command is executed.
    slashCommand?: (interaction: ChatInputCommandInteraction<CacheType>) => void;
    // The function to execute when the user menu command is executed.
    userMenuCommand?: (interaction: ContextMenuCommandInteraction<CacheType>) => void;
    // The function to execute when the message menu command is executed.
    messageMenuCommand?: (interaction: ContextMenuCommandInteraction<CacheType>) => void;
    // The function to execute when the command is interacted with.
    interact?: (interaction: ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction) => void;
}

// Used for slash commands.
export interface SlashCommand extends Command {
    slashCommand: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}

// Used for user menu commands.
export interface UserMenuCommand extends Command {
    userMenuCommand: (interaction: ContextMenuCommandInteraction<CacheType>) => void;
}

// Used for message menu commands.
export interface MessageMenuCommand extends Command {
    messageMenuCommand: (interaction: ContextMenuCommandInteraction<CacheType>) => void;
}

export function getDiscordCommands(): any[] {
    return getAllCommands().map(c => c.discordCommand);
}

const commands = getCommands("slash").concat(getCommands("user")).concat(getCommands("message"));

export function getCommandsByCategory(category: CommandCategory): Command[] {
    return commands.filter(c => c.commandCategory === category);
}

export function getAllCommands(): Command[] {
    return commands;
}

export function getCommands(dir: "slash" | "user" | "message"): Command[] {
    const files = fs.readdirSync(path.join(__dirname, `./${dir}`));
    const commands = files.map(file => {
        return require(`./${dir}/${file}`).default;
    });
    return commands;
}