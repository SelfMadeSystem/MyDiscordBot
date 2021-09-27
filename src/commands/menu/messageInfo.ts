import { Command } from '../command';
import { ContextMenuInteraction, SnowflakeUtil } from 'discord.js'

const command: Command = {
    name: 'Message Info',
    menuCommand(interaction: ContextMenuInteraction) {
        interaction.reply({
            content: 'Message Info',
            ephemeral: true
        })
    },
    discordCommand: {
        name: 'Message Info',
        type: 3
    }
}

export default command;