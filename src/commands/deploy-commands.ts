import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { clientId, guildId, token } from '../localconfig.json';
import { getDiscordCommands } from './command';

const rest = new REST({ version: '10' }).setToken(token);

// Finds all commands and adds them to the bot.
// Replace "applicationGuildCommands" with "applicationCommands" if using in production
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: getDiscordCommands() })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// Remove unused commands. For example:
// removeCommands('test', 'test2');

function removeCommands(...commands: string[]) {
	getCommandIDs(commands).then(ids => {
		for (const id of ids) {
			rest.delete(`/applications/${clientId}/guilds/${guildId}/commands/${id}`)
				.then(() => console.log(`Successfully removed command ${id}.`))
				.catch(console.error);
		}
	});
}

async function getCommandIDs(commands: string[]) {
	try {
		const result = [];
		const res = await rest.get(Routes.applicationGuildCommands(clientId, guildId)) as any;
		for (const command of res) {
			if (commands.includes(command.name)) {
				result.push(command.id);
			}
		}
		return result;
	} catch (message) {
		console.error(message);
	}
}