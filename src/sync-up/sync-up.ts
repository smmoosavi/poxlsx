import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { keyBy } from 'lodash';
import { FileConfig, getContext, GoogleKey } from '../context/context';
import { loadPoFile } from '../po-file/load-po-file';
import { getOrCreateSheet, loadDoc } from '../sheet/load-sheet';
import { TranslationItem } from '../translation/types';
import { logStats, SyncUpStats, updateStats } from './stats';

/**
 * @public
 */
export interface SyncUpOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export async function syncUp(options?: SyncUpOptions) {
  const context = getContext(options);
  for (let language of context.languages) {
    const config = context.fileConfigs[language];
    await syncUpFile(config, context.googleKey);
  }
}

export async function syncUpFile(config: FileConfig, googleKey: GoogleKey) {
  const poData = loadPoFile(config.po);
  const doc = await loadDoc(config.xlsx, googleKey);
  const sheet = await getOrCreateSheet(config.xlsx, doc);
  if (!sheet) {
    return;
  }
  const stats = await updateRows(sheet, poData);
  logStats(config, stats);
}

function getKey(data: Pick<TranslationItem, 'msgid' | 'msgctxt'>) {
  return `${data.msgid}-${data.msgctxt}`;
}

async function updateRows(
  sheet: GoogleSpreadsheetWorksheet,
  poData: TranslationItem[],
): Promise<SyncUpStats> {
  const visited = new Set();
  const indexedPoData = keyBy(poData, getKey);
  // @ts-ignore
  await sheet.loadCells();
  const rows = await sheet.getRows();
  let changed = false;
  const stats: SyncUpStats = { conflict: 0, added: 0, missing: 0 };
  rows.forEach((row) => {
    const { msgid = '', msgctxt = '', msgstr = '', po = '' } = row;
    const key = getKey({ msgid, msgctxt });
    const poRow = indexedPoData[key];
    const cell = sheet.getCell(row.rowIndex - 1, 3);
    updateStats(stats, { msgstr, po }, poRow);
    if (poRow) {
      visited.add(key);
      if (msgstr === poRow.msgstr && po !== '') {
        cell.value = '';
        changed = true;
      }
      if (msgstr !== poRow.msgstr && po !== poRow.msgstr) {
        cell.value = poRow.msgstr;
        changed = true;
      }
    }
  });
  changed && (await sheet.saveUpdatedCells());
  const extraRows: Array<Record<string, string>> = [];
  poData.forEach((row) => {
    const key = getKey(row);
    if (!visited.has(key)) {
      const { msgid, msgctxt, msgstr } = row;
      extraRows.push({ msgid, msgctxt, msgstr: '', po: msgstr });
    }
  });
  if (extraRows.length > 0) {
    stats.added = extraRows.length;
    await sheet.addRows(extraRows);
  }
  return stats;
}
