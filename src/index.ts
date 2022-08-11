import { Bot } from './bot';
import { CommandManager } from './commands/command';
import { MessageHandlerManager } from './events/messageHandler';
import { ReactionRoleManager } from './events/reactionRoles';

// Import the local config. Must contain the token.
import localConfig from './localconfig.json';

console.log('Starting bot...');

// Create bot
export const bot = new Bot(localConfig.token, localConfig.publicKey);

let botStarted = false;

const startingCBs: ((a: unknown) => void)[] = [];

export async function waitForBotStart() {
  if (botStarted) return;
  await new Promise(resolve => startingCBs.push(resolve));
}

(async () => {
  // Start bot
  await bot.start();

  // Create command manager
  new CommandManager(bot);

  // Create message handler (for antiswear and other administrative stuff)
  new MessageHandlerManager(bot);

  // Create reaction role manager
  new ReactionRoleManager(bot);

  botStarted = true;
  startingCBs.forEach(cb => cb(null));
})();

process.on('SIGINT', async function () {
  console.warn('SIGINT signal received.');

  if (!botStarted) {
    console.log("Bot not started. Waiting for it to start for clean shutdown...");
    await waitForBotStart();
  }

  console.log("Shutting down bot.");
  bot.stop();

  process.exit();
});