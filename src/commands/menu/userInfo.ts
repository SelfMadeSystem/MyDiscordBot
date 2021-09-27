import { Command } from '../command';
import { ContextMenuInteraction, SnowflakeUtil } from 'discord.js'

const command: Command = {
    name: 'User Info',
    menuCommand(interaction: ContextMenuInteraction) {
        interaction.reply({
            content: 'User Info',
            ephemeral: true
        })
    },
    discordCommand: {
        name: 'User Info',
        type: 2
    }
}

export default command;