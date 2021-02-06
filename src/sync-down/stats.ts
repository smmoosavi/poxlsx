import { FileConfig } from '../context/context';

export interface SyncDownStats {
  updated: number;
  same: number;
  missing: number;
}

export function updateStats(
  stats: SyncDownStats,
  newMsgstr: string | undefined,
  oldMsgstr: string,
) {
  if (newMsgstr) {
    if (newMsgstr !== oldMsgstr) {
      stats.updated++;
    }
    if (newMsgstr === oldMsgstr) {
      stats.same++;
    }
  }
  if (!newMsgstr) {
    stats.missing++;
  }
}

export function logStats(config: FileConfig, stats: SyncDownStats) {
  console.log(`${config.po}: ${stats.updated} message updated`);
}
