/**
 * sync po/xlsx files
 *
 * @remarks
 * sync po file and xlsx files/google sheet
 *
 * @packageDocumentation
 */

export declare function syncDown(options?: SyncDownOptions): void;

/**
 * @public
 */
export declare interface SyncDownOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export declare function syncUp(options?: SyncUpOptions): void;

/**
 * @public
 */
export declare interface SyncUpOptions {
  language?: string;
  keyFile?: string;
  configFile?: string;
}

export {};
