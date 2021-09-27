import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from '../localconfig.json';
import { getDiscordCommands } from './command';

const rest = new REST({ version: '9' }).setToken(token);


rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: getDiscordCommands().map(command => command.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// removeCommands('user', 'server')

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