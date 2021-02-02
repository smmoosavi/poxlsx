export interface TranslationItem {
  msgctxt: string;
  msgid: string;
  msgstr: string;
}

export interface WithPo {
  po: string;
}

export type TranslationItemWithPo = TranslationItem & WithPo;
