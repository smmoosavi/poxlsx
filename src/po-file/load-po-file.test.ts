import { loadPoFile } from './load-po-file';

describe('load po file', () => {
  let cwd = process.cwd();
  beforeEach(() => {
    process.chdir('src/__fixture__');
  });
  afterEach(() => {
    process.chdir(cwd);
  });
  it('should read po file', () => {
    const items = loadPoFile('en.po');
    expect(items[1]).toEqual({ msgid: 'apple', msgctxt: '', msgstr: 'apple' });
    expect(items[2]).toEqual({
      msgid: '{n} days',
      msgctxt: '',
      msgstr: '{n} days',
    });
    expect(items[3]).toEqual({
      msgid: 'multi\nline',
      msgctxt: '',
      msgstr: 'multi\nline',
    });
    expect(items[4]).toEqual({
      msgid: 'done',
      msgctxt: 'button',
      msgstr: 'done',
    });
  });
});
