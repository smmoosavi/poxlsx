import { keyBy } from 'lodash';
import { FileConfig, getContext, GoogleKey } from '../context/context';
import { loadPoFile } from '../po-file/load-po-file';
import { storePoFile } from '../po-file/store-po-file';
import { loadDoc, loadSheet } from '../sheet/load-sheet';
import { TranslationItem } from '../translation/types';
import { logStats, SyncDownStats, updateStats } from './stats';

/**
 * @public
 */
export interface SyncDownOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export async function syncDown(options?: SyncDownOptions) {
  const context = getContext(options);
  for (let language of context.languages) {
    const config = context.fileConfigs[language];
    await syncDownFile(config, context.googleKey);
  }
}

function getKey(data: TranslationItem) {
  return `${data.msgid}-${data.msgctxt}`;
}

export async function syncDownFile(config: FileConfig, googleKey: GoogleKey) {
  const poData = loadPoFile(config.po);
  const doc = await loadDoc(config.xlsx, googleKey);
  const sheetData = (await loadSheet(config.xlsx, doc)) ?? [];
  const [newPoData, stats] = addSheetDataToPoData(poData, sheetData);
  try {
    storePoFile(config.po, newPoData);
  } catch (e) {
    console.log(e);
  }
  logStats(config, stats);
}

function addSheetDataToPoData<T extends TranslationItem>(
  poData: T[],
  sheetData: TranslationItem[],
): [T[], SyncDownStats] {
  const indexedSheetData = keyBy(sheetData, getKey);
  const newPoData: T[] = [];
  const stats: SyncDownStats = { updated: 0, same: 0, missing: 0 };
  poData.forEach((row) => {
    const key = getKey(row);
    const newMsgstr = indexedSheetData[key]?.msgstr;
    updateStats(stats, newMsgstr, row.msgstr);
    const msgstr = newMsgstr || row.msgstr;
    const newRow: T = {
      ...row,
      msgstr,
    };
    newPoData.push(newRow);
  });
  return [newPoData, stats];
}
