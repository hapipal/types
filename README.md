# Hapipal Types

TypeScript type definitions for hapi pal

[![Build Status](https://travis-ci.com/hapipal/types.svg?branch=main)](https://travis-ci.com/hapipal/types)

Lead Maintainer - [Danilo Alonso](https://github.com/damusix)

## Contributing

Ideally, whatever you contribute comes with a relevant JSDoc to facilitate IDE auto-complete documentation. If you are writing a new library, please read below as to how to set it up. All typings should have tests that assume the shape of the data suggested.

### Set up

``` sh
git clone git@github.com:hapipal/types
npm install
```

### Test

``` sh
npm run test
```

### New library

Copy the template so you just have to replace `[name]` and `[version]` in all files

``` sh
cp -R teamplate types/[name]
```
