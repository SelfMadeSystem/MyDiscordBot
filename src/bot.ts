import { REST } from '@discordjs/rest';
import { Snowflake } from 'discord-api-types/v9';
import { Channel, TextChannel, Client, Intents, Message, MessagePayload } from 'discord.js';

export class Bot {
    private readonly client: Client;
    private clientID: Snowflake;
    private rest: REST;
    constructor(private readonly token: Snowflake) {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        this.rest = new REST({ version: '9' }).setToken(this.token);
    }

    public async start() {
        await this.client.login(this.token);
        this.clientID = this.client.user.id;
        this.client.on('ready', () => this.onReady());
        this.client.on('messageCreate', (e) => this.onMessage(e));
    }

    private onReady() {
        console.log(`Logged in as ${this.client.user.tag}!`);
        this.client.user.setStatus('online');
    }

    private async onMessage(m: Message) {
        if (m.author.id === this.clientID) return;
        if (m.channel.type !== 'GUILD_TEXT') return;
        const channel = m.channel as TextChannel;
        if (m.content.startsWith('!hi')) {
            await m.reply(MessagePayload.create(channel, "Hi"));
        }
    }

    public async stop() {
        this.client.user.setStatus('invisible');
        this.client.destroy();
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

    public getRest() {
        return this.rest;
    }
}