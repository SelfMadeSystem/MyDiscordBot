import { Snowflake } from 'discord-api-types/v9';
import { Client, EmbedFooterData, GatewayIntentBits, Partials } from 'discord.js';

/*
 * Bot class
 */
export class Bot {
    public readonly client: Client;
    public get name(): string {
        return this.client.user.username;
    }
    public get id(): Snowflake {
        return this.client.user.id;
    }
    public readonly version = '0.0.1'; // Bot version
    public get footer(): EmbedFooterData {
        return {
            text: `Version ${this.version}`,
            iconURL: this.client.user.avatarURL(),
        };
    }
    private clientID: Snowflake;

    /**
     * Constructor. Initializes the bot with the given token.
     * 
     * @param token Discord token
     * @param publicKey Public key for the bot to verify interactions TODO: implement
     */
    constructor(private readonly token: Snowflake,
        private readonly publicKey: string) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        });
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
}