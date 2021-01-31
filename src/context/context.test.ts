import { getContext, parseXlsxUrl } from './context';

describe('parseXlsxUrl', () => {
  it('should parse url with sheet', () => {
    expect(
      parseXlsxUrl('google://PVNWeXQTmAG1ynle5UBSSCnMpLWdXVZ1#fa'),
    ).toEqual({
      id: 'PVNWeXQTmAG1ynle5UBSSCnMpLWdXVZ1',
      sheet: 'fa',
    });
  });
  it('should parse url without sheet', () => {
    expect(parseXlsxUrl('google://PVNWeXQTmAG1ynle5UBSSCnMpLWdXVZ1')).toEqual({
      id: 'PVNWeXQTmAG1ynle5UBSSCnMpLWdXVZ1',
      sheet: null,
    });
  });
  it('should returns null for invalid url', () => {
    expect(parseXlsxUrl('http://google.com/#page')).toBeNull();
  });
});

describe('getContext', () => {
  let cwd = process.cwd();
  beforeEach(() => {
    process.chdir('src/__fixture__');
  });
  afterEach(() => {
    process.chdir(cwd);
  });
  it('should load config with configFile option', () => {
    const context = getContext({ configFile: 'config.yml' });
    expect(context.languages).toHaveLength(1);
  });
  it('should load config with keyFile option', () => {
    const context = getContext({ keyFile: 'key2.json' });
    expect(context.googleKey.client_email).toBe(
      'sample-bot2@sample-app.iam.gserviceaccount.com',
    );
  });
  it('should load config with keyFile option', () => {
    const context = getContext({ language: 'fa' });
    expect(context.languages).toEqual(['fa']);
  });
  it('should load config without option', () => {
    const context = getContext();
    expect(context.languages).toHaveLength(2);
  });
});
