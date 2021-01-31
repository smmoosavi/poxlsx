import sade from 'sade';
import { syncUp, syncDown } from '..';

const prog = sade('poxlsx');

prog
  .option('-c, --config-file', 'path to config file')
  .option('-k, --key-file', 'path to google key file');

prog.command('help', 'Display help', { default: true }).action(() => {
  // @ts-ignore
  prog.help();
});

prog
  .command('up [language]')
  .describe('Sync po file to the xlxs file/google sheet')
  .action((language, opts) => {
    syncUp({
      language,
      keyFile: opts['key-file'],
      configFile: opts['config-file'],
    });
  });

prog
  .command('down [language]')
  .describe('Sync xlxs file/google sheet to the po file')
  .action((language, opts) => {
    syncDown({
      language,
      keyFile: opts['key-file'],
      configFile: opts['config-file'],
    });
  });

prog.parse(process.argv);
