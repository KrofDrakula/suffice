# Suffice

![GitHub Actions Status](https://github.com/krofdrakula/suffice/actions/workflows/tests.yml/badge.svg)

A lightweight Excel-like spreadsheet application. Do what you need, and nothing more.

## Parts list

The application is divided into separate `pnpm` packages in the `packages/` directory. When running a command, make sure to switch your current working directory into the relevant package.

- [`interpreter`](#interpreter) contains the expression parser and compiler for cell content

## Development

You'll need to install `pnpm` globally:

```
npm i -g pnpm
```

After checking out the project, run `pnpm install` in the root directory to download all dependencies.

### `interpreter`

This package uses `peggy` to compile a PEG parser into JS, and the file is not checked into source by design. Build the parser using the `build-grammar` script:

```
pnpm build-grammar
```

This will build the parser in `src/grammar/index.js` which is then imported and built into an exported package.
