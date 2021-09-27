import { Bot } from '../bot';
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, Snowflake } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';
import fs from 'fs';


export class CommandManager {
    private commands: Command[] = [];

    constructor(private bot: Bot) {
        this.commands = getCommands();
        this.hook();
    }

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    public slash(command: string, interaction: CommandInteraction): void {
        const commandToExecute = this.commands.find(
            (c) => c.name === command
        );

        if (commandToExecute) {
            commandToExecute?.slashCommand(interaction);
        } else {
            console.warn(`Command ${command} not found`);
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
    return getCommands().map(c => c.discordCommand);
}

export function getCommands(): Command[] {
    const files = fs.readdirSync(path.join(__dirname, './slash'));
    const commands = files.map(file => {
        return require(`./slash/${file}`).default;
    });
    return commands;
}