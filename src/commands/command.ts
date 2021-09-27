import { Bot } from '../bot';
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, Snowflake } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';
import fs from 'fs';


export class CommandManager {
    private commands: Command[] = [];
    private slashCommands: Command[] = [];
    private menuCommands: Command[] = [];

    constructor(private bot: Bot) {
        this.slashCommands = getCommands("slash");
        this.menuCommands = getCommands("menu");
        this.commands = [...this.slashCommands, ...this.menuCommands];
        this.hook();
    }

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    public slash(command: string, interaction: CommandInteraction): void {
        const commandToExecute = this.slashCommands.find(
            (c) => c.name === command
        );

        if (commandToExecute) {
            commandToExecute?.slashCommand(interaction);
        } else {
            console.warn(`Slash command ${command} not found`);
        }
    }

    public menu(command: string, interaction: ContextMenuInteraction): void {
        const commandToExecute = this.menuCommands.find(
            (c) => c.name === command
        );

        if (commandToExecute) {
            commandToExecute?.menuCommand(interaction);
        } else {
            console.warn(`Menu command ${command} not found`);
        }
    }

    public interact(id: string, interaction: ButtonInteraction | SelectMenuInteraction) {
        const command = this.commands.find(
            (c) => c.interactionIds?.includes(id)
        );

        if (command) {
            command?.interact(interaction);
        } else {
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

export interface Command {
    name: string;
    discordCommand: any;
    interactionIds?: string[] | undefined;
    slashCommand?: (interaction: CommandInteraction) => void | undefined;
    menuCommand?: (interaction: ContextMenuInteraction) => void | undefined;
    interact?: (interaction: ButtonInteraction | SelectMenuInteraction) => void | undefined;
}

export function getDiscordCommands(): any[] {
    return getAllCommands().map(c => c.discordCommand);
}

export function getAllCommands(): Command[] {
    return getCommands("slash").concat(getCommands("menu"));
}

export function getCommands(dir: string): Command[] {
    const files = fs.readdirSync(path.join(__dirname, `./${dir}`));
    const commands = files.map(file => {
        return require(`./${dir}/${file}`).default;
    });
    return commands;
}