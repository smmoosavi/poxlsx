import fs from 'fs';
import gettextParser from 'gettext-parser';
import { TranslationItemWithComments } from '../translation/types';

export function loadPoFile(path: string): TranslationItemWithComments[] {
  const content = fs.readFileSync(path);
  const po = gettextParser.po.parse(content);
  const dicts = Object.values(po.translations);
  const items: TranslationItemWithComments[] = [];

  dicts.forEach((dict) => {
    const msgs = Object.values(dict);
    msgs.forEach((msg) => {
      const msgstr = msg.msgstr.join('');
      const msgctxt = msg.msgctxt ?? '';
      const msgid = msg.msgid;
      const comments = msg.comments;
      if (msgid !== '') {
        items.push({ msgid, msgctxt, msgstr, comments });
      }
    });
  });
  return items;
}
