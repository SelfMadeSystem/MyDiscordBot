import { SlashCommand } from '../command';
import { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const command: SlashCommand = {
    commandCategory: 'misc',

    slashCommand(interaction: CommandInteraction): void {
        interaction.deferReply({ fetchReply: true, }).then((e) => {
            setTimeout(() => {
                interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Some title')
                        .setURL('https://discord.js.org/')
                        .setAuthor({
                            "name": 'Some name',
                            "iconURL": 'https://i.imgur.com/AfFp7pu.png',
                            "url": 'https://discord.js.org'
                        })
                        .setDescription('Some description here')
                        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                        .addFields(
                            { name: 'Regular field title', value: 'Some value here' },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Inline field title', value: 'Some value here', inline: true },
                            { name: 'Inline field title', value: 'Some value here', inline: true },
                        )
                        .addField('Inline field title', 'Some value here', true)
                        .setImage('https://i.imgur.com/AfFp7pu.png')
                        .setTimestamp()
                        .setFooter({ "text": 'Some footer text here', "iconURL": 'https://i.imgur.com/AfFp7pu.png' })]
                })
            }, 1000);
        });
    },

    discordCommand: new SlashCommandBuilder().setName('ping').setDescription('Hi I guess').toJSON()
}

export default command;