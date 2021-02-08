# poxlsx

[![NPM version](https://badgen.net/npm/v/poxlsx)](https://npmjs.com/package/poxlsx)
[![NPM downloads](https://badgen.net/npm/dm/poxlsx)](https://npmjs.com/package/poxlsx)

sync po files with google sheets

## Install

```bash
yarn add poxlsx
```

## Configuration

sample `.poxlsxrc` file

```
files:
  - language: fa
    po: fa.po
    xlsx: google://1ysPqvxVFJaRVSwPLwsj54xnGf5vULPQdVl7jf_qBWBo#fa
  - language: ar
    po: ar.po
    xlsx: google://1ysPqvxVFJaRVSwPLwsj54xnGf5vULPQdVl7jf_qBWBo#ar
key-file: key.json

```

**files:** an array of file config including

- `language`: language code
- `po`: po file path
- `xlsx`: urls like google sheet id and sheet title

```
google://1ysPqvxVFJaRVSwPLwsj54xnGf5vULPQdVl7jf_qBWBo#ar
         |                              | ^^
         |                              | title
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         file id from google sheet url:
         https://docs.google.com/spreadsheets/d/1ysPqvxVFJaRVSwPLwsj54xnGf5vULPQdVl7jf_qBWBo/edit
```

**key-file:** google service authentication key file. [read more][key]

## Usage

### sync po to google sheet

sync all po files to google sheet

```bash
poxlsx up
```

sync po file related to one language to google sheet

```bash
poxlsx up fa
```

**options:**

```
poxlsx up --help

  Description
    Sync po file to the google sheet

  Usage
    $ poxlsx up [language] [options]

  Options
    -c, --config-file    path to config file
    -k, --key-file       path to google key file
    -h, --help           Displays this message

```

### sync google sheet to po

sync all google sheets to po files

```bash
poxlsx down
```

sync google sheet related to one language to po file

```bash
poxlsx down fa
```

```
sync down --help

  Description
    Sync google sheet to the po file

  Usage
    $ poxlsx down [language] [options]

  Options
    -c, --config-file    path to config file
    -k, --key-file       path to google key file
    -h, --help           Displays this message

```

### help

```
poxlsx --help

Usage
$ poxlsx <command> [options]

Available Commands
help    Display help
up      Sync po file to the google sheet
down    Sync google sheet to the po file

For more info, run any command with the `--help` flag
$ poxlsx help --help
$ poxlsx up --help

Options
-c, --config-file    path to config file
-k, --key-file       path to google key file
-v, --version        Displays current version
-h, --help           Displays this message

```

## google sheet columns

each google sheets has these columns (automatically added by `poxlsx up`)

| msgid    | msgctxt |    msgstr |      po |
| -------- | ------- | --------: | ------: |
| Apple    |         |       سیب |         |
| {n} days |         | {n} روزها | {n} روز |

- **msgid:** `msgid` from po file
- **msgctxt:** `msgctxt` from po file if existed
- **msgstr:** translations that should be applied to po file with `poxlsx down` command
- **po:** translations from po file add with `poxlsx up` command if msgstr column and po file msgstr has a conflict

[key]: https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account
