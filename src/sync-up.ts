import { getContext } from './context/context';

/**
 * @public
 */
export interface SyncUpOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export function syncUp(options?: SyncUpOptions) {
  console.log('sync up');
  const context = getContext(options);
  console.log(context);
}
