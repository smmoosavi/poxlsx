import gettextParser from 'gettext-parser';
import fs from 'fs';
import { TranslationItem } from '../translation/types';

export function loadPoFile(path: string): TranslationItem[] {
  const content = fs.readFileSync(path);
  const po = gettextParser.po.parse(content);
  const dicts = Object.values(po.translations);
  const items: TranslationItem[] = [];

  dicts.forEach((dict) => {
    const msgs = Object.values(dict);
    msgs.forEach((msg) => {
      const msgstr = msg.msgstr.join('');
      const msgctxt = msg.msgctxt ?? '';
      const msgid = msg.msgid;
      items.push({ msgid, msgctxt, msgstr });
    });
  });
  return items;
}
