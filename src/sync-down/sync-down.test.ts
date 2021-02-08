import mockFs from 'mock-fs';
import { GOOGLE_KEY_PATH, resetSheets, sheetId } from '../__fixture__/sheet';
import { FileConfig, loadKeyFile } from '../context/context';
import { loadPoFile } from '../po-file/load-po-file';
import { syncDownFile } from './sync-down';

describe('sync-up', () => {
  beforeEach(async () => {
    await resetSheets();
  }, 50000);
  afterAll(() => {
    mockFs.restore();
  });
  it('should update doc', async () => {
    const key = loadKeyFile(GOOGLE_KEY_PATH);
    const config: FileConfig = {
      po: '/root/fa.po',
      xlsx: { id: sheetId, sheet: 'fa' },
      language: 'fa',
    };
    mockFs({
      '/root/fa.po': mockFs.load('src/__fixture__/fa.po'),
    });
    await syncDownFile(config, key);

    const data = (await loadPoFile(config.po)) ?? [];

    expect(data[0]).toEqual({
      msgid: 'Apple',
      msgctxt: '',
      msgstr: 'سیب',
      comments: undefined,
    });
    expect(data[1]).toEqual({
      msgid: 'red',
      msgctxt: '',
      msgstr: 'قرمز',
      comments: undefined,
    });
    expect(data[2]).toEqual({
      msgid: '{n} days',
      msgctxt: '',
      msgstr: '{n} روزها',
      comments: undefined,
    });
    expect(data[3]).toEqual({
      msgid: 'Done',
      msgctxt: 'button',
      msgstr: 'اتمام',
      comments: undefined,
    });
  }, 50000);
});
