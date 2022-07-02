import { Bot } from './bot';
import { CommandManager } from './commands/command';

// Import the local config. Must contain the token.
import localConfig from './localconfig.json';

// Create bot
const bot = new Bot(localConfig.token, localConfig.publicKey);

// Start bot
bot.start();

// Create command manager
new CommandManager(bot);

process.on('SIGINT', function () {
  console.warn('SIGINT signal received.');
  console.log("Shutting down bot.");

  bot.stop();

  process.exit();
});