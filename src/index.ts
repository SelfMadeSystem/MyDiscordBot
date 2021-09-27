import { Bot } from './bot';
import { CommandManager } from './commands/command';

import localConfig from './localconfig.json';

const bot = new Bot(localConfig.token);

bot.start();

const commandManager = new CommandManager(bot);

process.on('SIGINT', function () {
  console.warn('SIGINT signal received.');
  console.log("Shutting down bot.");

  bot.stop();

  process.exit();
});