import { GetTextComment } from 'gettext-parser';

export interface TranslationItem {
  msgctxt: string;
  msgid: string;
  msgstr: string;
}

export interface WithPo {
  po: string;
}

export interface WithComments {
  comments?: GetTextComment;
}

export type TranslationItemWithPo = TranslationItem & WithPo;
export type TranslationItemWithComments = TranslationItem & WithComments;
