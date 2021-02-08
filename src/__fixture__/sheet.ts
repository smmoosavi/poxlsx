import { GoogleSpreadsheet } from 'google-spreadsheet';
import { loadKeyFile } from '../context/context';
import { loadDoc } from '../sheet/load-sheet';

interface SheetData {
  title: string;
  headers: string[];
  rows: Array<Record<string, string>> | Array<Array<string>>;
}

export const sheetId = '1ysPqvxVFJaRVSwPLwsj54xnGf5vULPQdVl7jf_qBWBo';

export const faRows = [
  { msgctxt: '', msgid: 'Apple', msgstr: 'سیب', po: 'سیب' },
  { msgctxt: '', msgid: '{n} days', msgstr: '{n} روزها', po: '' },
  { msgctxt: 'home', msgid: 'Key', msgstr: 'کلید', po: '' },
  { msgctxt: '', msgid: 'red', msgstr: 'قرمز', po: '' },
];

export const sheets: Record<string, SheetData> = {
  fa: {
    title: 'fa',
    headers: ['msgid', 'msgctxt', 'msgstr', 'po'],
    rows: faRows,
  },
  ar: {
    title: 'ar',
    headers: ['msgid', 'msgctxt', 'msgstr', 'po'],
    rows: [
      { msgctxt: '', msgid: 'Apple', msgstr: 'تفاحة', po: '' },
      { msgctxt: '', msgid: '{n} days', msgstr: '{n} ایام', po: '' },
      { msgctxt: '', msgid: 'Key', msgstr: 'مفتاح', po: '' },
    ],
  },
  invalid: {
    title: 'invalid',
    headers: ['date', 'price', 'count'],
    rows: [['2021-02-01', '3.4', '3']],
  },
};

async function removeSheets(doc: GoogleSpreadsheet) {
  if (!doc.sheetsByTitle['keep']) {
    await doc.addSheet({ title: 'keep' });
  }
  const sheets = Object.values(doc.sheetsByIndex);
  await Promise.all(
    sheets.map((sheet) => {
      if (sheet.title !== 'keep') {
        return sheet.delete();
      }
      return Promise.resolve();
    }),
  );
}

async function syncSheet(doc: GoogleSpreadsheet, lang: string) {
  const data = sheets[lang];
  const sheet = await doc.addSheet({ title: lang, headerValues: data.headers });
  await sheet.addRows(data.rows);
}

export async function resetSheets() {
  const key = loadKeyFile('../google-keys/key.json');
  const doc = await loadDoc({ id: sheetId }, key);
  await removeSheets(doc);
  await syncSheet(doc, 'fa');
  await syncSheet(doc, 'ar');
  await syncSheet(doc, 'invalid');
}
