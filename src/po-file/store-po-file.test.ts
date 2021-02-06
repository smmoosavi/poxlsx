import mockFs from 'mock-fs';
import { loadPoFile } from './load-po-file';
import { storePoFile } from './store-po-file';
import { faRows } from '../__fixture__/sheet';

describe('store po file', () => {
  afterAll(() => {
    mockFs.restore();
  });
  it('should write po files', () => {
    mockFs({
      '/root/fa.po': mockFs.load('src/__fixture__/fa.po'),
    });
    storePoFile('/root/fa.po', faRows);
    const data = loadPoFile('/root/fa.po');
    expect(data[1]).toEqual({ msgid: 'Apple', msgctxt: '', msgstr: 'سیب' });
    expect(data[2]).toEqual({ msgid: 'red', msgctxt: '', msgstr: 'قرمز' });
    expect(data[3]).toEqual({
      msgid: '{n} days',
      msgctxt: '',
      msgstr: '{n} روزها',
    });
    expect(data[4]).toEqual({ msgid: 'Key', msgctxt: 'home', msgstr: 'کلید' });
  });
});
