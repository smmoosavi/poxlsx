import sade from 'sade';
import { syncUp, syncDown } from '..';

const prog = sade('poxlsx');

prog.command('help', 'Display help', { default: true }).action(() => {
  // @ts-ignore
  prog.help();
});

prog
  .command('up')
  .describe('Sync po file to the xlxs file/google sheet')
  .action(() => {
    syncUp();
  });

prog
  .command('down')
  .describe('Sync xlxs file/google sheet to the po file')
  .action(() => {
    syncDown();
  });

prog.parse(process.argv);
