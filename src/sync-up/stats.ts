import { FileConfig } from '../context/context';
import { TranslationItem, TranslationItemWithPo } from '../translation/types';

export interface SyncUpStats {
  missing: number;
  added: number;
  conflict: number;
}

export function updateStats(
  stats: SyncUpStats,
  sheetRow: Pick<TranslationItemWithPo, 'msgstr' | 'po'>,
  poRow: TranslationItem | undefined,
) {
  if (!poRow) {
    return;
  }
  if (sheetRow.msgstr === '') {
    stats.missing++;
    return;
  }
  if (sheetRow.msgstr !== poRow.msgstr) {
    stats.conflict++;
  }
}

export function logStats(config: FileConfig, stats: SyncUpStats) {
  console.log(
    `${config.po}: ${stats.added} message(s) added, ${stats.conflict} conflict`,
  );
}
