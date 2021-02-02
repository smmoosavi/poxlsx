import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { isEqual } from 'lodash';
import { GoogleKey, XlsxFile } from '../context/context';
import { TranslationItemWithPo } from '../translation/types';

export async function loadSheet(xlsx: XlsxFile, googleKey: GoogleKey) {
  const doc = await loadDoc(xlsx, googleKey);
  const sheet = await getOrCreateSheet(xlsx, doc);
  if (!sheet) {
    return;
  }
  return await loadData(sheet);
}

export async function loadDoc(
  xlsx: Pick<XlsxFile, 'id'>,
  googleKey: GoogleKey,
) {
  const doc = new GoogleSpreadsheet(xlsx.id);
  await doc.useServiceAccountAuth(googleKey);
  await doc.loadInfo();
  return doc;
}

async function getOrCreateSheet(xlsx: XlsxFile, doc: GoogleSpreadsheet) {
  const sheet = await getSheet(xlsx, doc);
  if (sheet) {
    if (!(await validateSheet(sheet))) {
      throw new Error('invalid sheet'); // TODO improve
    }
    return sheet;
  } else {
    return await createSheet(xlsx, doc);
  }
}

async function getSheet(
  xlsx: XlsxFile,
  doc: GoogleSpreadsheet,
): Promise<GoogleSpreadsheetWorksheet | null> {
  if (xlsx.sheet) {
    return doc.sheetsById[xlsx.sheet] ?? doc.sheetsByTitle[xlsx.sheet] ?? null;
  } else {
    return doc.sheetsByIndex[0] ?? null;
  }
}

const headerValues = ['msgid', 'msgctxt', 'msgstr', 'po'];

async function validateSheet(
  sheet: GoogleSpreadsheetWorksheet,
): Promise<boolean> {
  await sheet.loadHeaderRow();
  const headers = sheet.headerValues;
  return isEqual(headers, headerValues);
}

async function createSheet(xlsx: XlsxFile, doc: GoogleSpreadsheet) {
  if (xlsx.sheet) {
    return await doc.addSheet({ title: xlsx.sheet, headerValues });
  }
}

async function loadData(
  sheet: GoogleSpreadsheetWorksheet,
): Promise<TranslationItemWithPo[]> {
  const rows = await sheet.getRows();
  const items: TranslationItemWithPo[] = [];
  rows.forEach((row) => {
    const { msgctxt = '', msgid = '', msgstr = '', po = '' } = row;
    const item: TranslationItemWithPo = { msgctxt, msgid, msgstr, po };
    items.push(item);
  });
  return items;
}
