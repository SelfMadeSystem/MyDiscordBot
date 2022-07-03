import { Bot } from './bot';
import { CommandManager } from './commands/command';
import { MessageHandlerManager } from './events/messageHandler';

// Import the local config. Must contain the token.
import localConfig from './localconfig.json';

// Create bot
export const bot = new Bot(localConfig.token, localConfig.publicKey);

// Start bot
bot.start();

// Create command manager
new CommandManager(bot);

// Create message handler (for antiswear and other administrative stuff)
new MessageHandlerManager(bot);

process.on('SIGINT', function () {
  console.warn('SIGINT signal received.');
  console.log("Shutting down bot.");

  bot.stop();

  process.exit();
});