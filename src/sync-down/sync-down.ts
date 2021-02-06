import { getContext } from '../context/context';

/**
 * @public
 */
export interface SyncDownOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export function syncDown(options?: SyncDownOptions) {
  console.log('sync down');
  const context = getContext(options);
  console.log(context);
}
