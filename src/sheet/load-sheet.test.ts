import { resetSheets, sheetId } from '../__fixture__/sheet';
import { loadKeyFile } from '../context/context';
import { loadDoc, loadSheet } from './load-sheet';

describe('load google sheet', () => {
  beforeAll(async () => {
    await resetSheets();
  }, 50000);
  it('should load doc', async () => {
    const key = loadKeyFile('../google-keys/key.json');
    const doc = await loadDoc({ id: sheetId }, key);
    const data = await loadSheet({ sheet: 'fa' }, doc);
    expect(data?.[0]).toEqual({
      msgctxt: '',
      msgid: 'Apple',
      msgstr: 'سیب',
      po: 'سیب',
    });
    expect(data?.[1]).toEqual({
      msgctxt: '',
      msgid: '{n} days',
      msgstr: '{n} روزها',
      po: '',
    });
    expect(data?.[2]).toEqual({
      msgctxt: 'home',
      msgid: 'Key',
      msgstr: 'کلید',
      po: '',
    });
  }, 50000);
  it('should create sheet if not existed', async () => {
    const key = loadKeyFile('../google-keys/key.json');
    const doc = await loadDoc({ id: sheetId }, key);
    const data = await loadSheet({ sheet: 'ru' }, doc);
    expect(data).toHaveLength(0);
    await doc.loadInfo();
    expect(doc.sheetsByTitle['ru']).toBeDefined();
  }, 50000);
  it('should leave invalid sheet', async () => {
    const key = loadKeyFile('../google-keys/key.json');
    const doc = await loadDoc({ id: sheetId }, key);
    const promise = loadSheet({ sheet: 'invalid' }, doc);
    await expect(promise).rejects.toThrowError('invalid sheet');
  }, 50000);
});
