import { REST } from '@discordjs/rest';
import { Snowflake } from 'discord-api-types/v9';
import { TextChannel, Client, Intents, Message, MessagePayload } from 'discord.js';

/*
 * Bot class
 */
export class Bot {
    private readonly client: Client;
    private clientID: Snowflake;

    /**
     * Constructor. Initializes the bot with the given token.
     * 
     * @param token Discord token
     */
    constructor(private readonly token: Snowflake) {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    }

    /**
     * Starts the bot.
     */
    public async start() {
        await this.client.login(this.token); // Login
        this.clientID = this.client.user.id; // Get client ID
        this.client.on('ready', () => this.onReady()); // On ready
    }

    /**
     * Called when the bot is ready.
     */
    private onReady() {
        console.log(`Logged in as ${this.client.user.tag}!`); // Announce login
        this.client.user.setStatus('online'); // Set status (not necessary, but nice to specify)
    }

    /**
     * Called to stop the bot.
     */
    public stop() {
        this.client.user.setStatus('invisible'); // Set status
        this.client.destroy(); // Destroy client
    }

    public getClient() {
        return this.client;
    }

    public getClientID() {
        return this.clientID;
    }

    public getToken() {
        return this.token;
    }
}