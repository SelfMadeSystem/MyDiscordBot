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

    public execute(command: string, interaction: CommandInteraction): void {
        const commandToExecute = this.commands.find(
            (c) => c.name === command
        );

        if (commandToExecute) {
            commandToExecute.command(interaction);
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
        }
    }

    private hook() {
        this.bot.getClient().on('interactionCreate', async interaction => {
            if (interaction.isCommand()) {

                const { commandName } = interaction;

                this.execute(commandName, interaction);
            } else if (interaction.isButton() || interaction.isSelectMenu()) {
                const { customId } = interaction;

                this.interact(customId, interaction);
            } else {
                console.warn(`Unknown interaction type ${interaction.type}`);
            }
        });
    }
}

export class Command {
    public name: string;
    public interactionIds: string[] | undefined;
    public command: (interaction: CommandInteraction) => void;
    public interact: (interaction: ButtonInteraction | SelectMenuInteraction) => void | undefined;

    constructor(
        name: string,
        interactionIds: string[] | undefined,
        command: (interaction: CommandInteraction) => void,
        interact: (interaction: ButtonInteraction | SelectMenuInteraction) => void | undefined) {
        this.name = name;
        this.interactionIds = interactionIds;
        this.command = command;
        this.interact = interact;
    }
}

export function getDiscordCommands(): SlashCommandBuilder[] {
    const files = fs.readdirSync(path.join(__dirname, './commands'));
    const commands = files.map(file => require(`./commands/${file}`).discordCommand as SlashCommandBuilder);
    return commands;
}

export function getCommands(): Command[] {
    const files = fs.readdirSync(path.join(__dirname, './commands'));
    const commands = files.map(file => {
        const c = require(`./commands/${file}`);
        return new Command(c.name, c.interactionIds, c.command, c.interact);
    });
    return commands;
}