import { resetSheets, sheetId } from '../__fixture__/sheet';
import { FileConfig, loadKeyFile } from '../context/context';
import { loadDoc, loadSheet } from '../sheet/load-sheet';
import { syncUpFile } from './sync-up';

describe('sync-up', () => {
  beforeEach(async () => {
    await resetSheets();
  }, 50000);
  it('should update doc', async () => {
    const key = loadKeyFile('../google-keys/key.json');
    const config: FileConfig = {
      po: 'src/__fixture__/fa.po',
      xlsx: { id: sheetId, sheet: 'fa' },
      language: 'fa',
    };
    await syncUpFile(config, key);

    const doc = await loadDoc(config.xlsx, key);
    const data = (await loadSheet(config.xlsx, doc)) ?? [];

    expect(data[0]).toEqual({
      msgctxt: '',
      msgid: 'Apple',
      msgstr: 'سیب',
      po: '',
    });
    expect(data[1]).toEqual({
      msgctxt: '',
      msgid: '{n} days',
      msgstr: '{n} روزها',
      po: '{n} روز',
    });
    expect(data[2]).toEqual({
      msgctxt: 'home',
      msgid: 'Key',
      msgstr: 'کلید',
      po: '',
    });
    expect(data[3]).toEqual({
      msgctxt: '',
      msgid: 'red',
      msgstr: 'قرمز',
      po: '',
    });
    expect(data[4]).toEqual({
      msgctxt: 'button',
      msgid: 'Done',
      msgstr: '',
      po: 'اتمام',
    });
  }, 50000);
});
