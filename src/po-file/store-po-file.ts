import fs from 'fs';
import gettextParser, {
  GetTextTranslation,
  GetTextTranslations,
} from 'gettext-parser';
import { set } from 'lodash';
import { TranslationItemWithComments } from '../translation/types';

export function storePoFile(path: string, data: TranslationItemWithComments[]) {
  const content = fs.readFileSync(path);
  const po = gettextParser.po.parse(content);
  const translations: GetTextTranslations['translations'] = convertTranslationItemToPoTranslations(
    data,
  );
  const newPo = { ...po, translations };
  const newContent =
    gettextParser.po
      .compile(newPo, { sort: true, foldLength: 120 })
      .toString() + '\n';
  fs.writeFileSync(path, newContent);
}

function convertTranslationItemToPoTranslations(
  data: TranslationItemWithComments[],
): GetTextTranslations['translations'] {
  const output: GetTextTranslations['translations'] = {};
  data.forEach((row) => {
    const { msgctxt, msgid, msgstr, comments } = row;
    if (msgid === '' && msgctxt === '') {
      return;
    }
    const item: GetTextTranslation = {
      msgid,
      msgctxt: msgctxt || undefined,
      msgstr: [msgstr],
      comments,
    };
    set(output, [msgctxt, msgid], item);
  });
  return output;
}
