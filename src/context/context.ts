import loadJson from 'load-json-file';
import { cosmiconfigSync } from 'cosmiconfig';
import { URL } from 'url';
import { indexBy } from './index-by';

export interface GetContextOptions {
  keyFile?: string;
  configFile?: string;
  language?: string;
}

export interface XlsxFile {
  id: string;
  sheet: string | null;
}

export interface FileConfig {
  language: string;
  po: string;
  xlsx: XlsxFile;
}

export interface Context {
  languages: string[];
  fileConfigs: Record<string, FileConfig>;
  googleKey: GoogleKey;
}

interface Config {
  files: Array<{ language: string; po: string; xlsx: string }>;
  'key-file'?: string;
}

export interface GoogleKey {
  client_email: string;
  private_key: string;
}

export function getContext(options: GetContextOptions = {}): Context {
  const config = loadConfig(options);
  return createContext(options, config);
}

function loadConfig(options: GetContextOptions): Config {
  const explorer = cosmiconfigSync('poxlsx');
  if (options.configFile) {
    const config: any = explorer.load(options.configFile)?.config ?? {};
    return config;
  }
  // TODO remove any after validate
  const config: any = explorer.search()?.config ?? {};
  return config;
}

function createContext(options: GetContextOptions, config: Config): Context {
  const files = parseFiles(config);
  const keyFilePath = getKeyFilePath(options, config);
  const googleKey = loadKeyFile(keyFilePath);
  let languages = getLanguages(options, config);
  const fileConfigs = indexBy('language', files);
  return {
    googleKey,
    fileConfigs,
    languages,
  };
}

function parseFiles(config: Config): FileConfig[] {
  return config.files.map(
    (file: any): FileConfig => {
      const { language, po, xlsx: url } = file;
      const xlsx = parseXlsxUrl(url);
      if (xlsx === null) {
        throw Error(`Invalid xlsx url: ${url}`);
      }
      return {
        language,
        po,
        xlsx,
      };
    },
  );
}

function getKeyFilePath(options: GetContextOptions, config: Config): string {
  const keyFile = options.keyFile ?? getKeyFilePathFromConfig(config);
  if (!keyFile) {
    throw new Error('key file not provided');
  }
  return keyFile;
}

export function getKeyFilePathFromConfig(config: Config) {
  return config['key-file'];
}

export function loadKeyFile(path: string): GoogleKey {
  // TODO remove any after validate
  const key: any = loadJson.sync(path);
  return {
    client_email: key.client_email,
    private_key: key.private_key,
  };
}

function getLanguages(options: GetContextOptions, config: Config): string[] {
  const languages = config.files.map((file) => file.language);
  const language = options.language;
  if (language && !languages.includes(language)) {
    throw new Error(
      `invalid language ${language}, available languages: ${languages.join(
        ' ,',
      )}`,
    );
  }
  return language ? [language] : languages;
}

export function parseXlsxUrl(url: string): XlsxFile | null {
  const info = new URL(url);
  if (info.protocol === 'google:') {
    return {
      id: info.host,
      sheet: info.hash ? info.hash.substring(1) : null,
    };
  }
  return null;
}
