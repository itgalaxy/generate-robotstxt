# generate-robotstxt

[![NPM version](https://img.shields.io/npm/v/generate-robotstxt.svg)](https://www.npmjs.org/package/generate-robotstxt) [![Travis Build Status](https://img.shields.io/travis/itgalaxy/generate-robotstxt/master.svg?label=build)](https://travis-ci.org/itgalaxy/generate-robotstxt) [![Deps](https://david-dm.org/itgalaxy/generate-robotstxt/status.svg)](https://david-dm.org/itgalaxy/generate-robotstxt#info=dependencies&view=table) [![Dev Deps](https://david-dm.org/itgalaxy/generate-robotstxt/dev-status.svg)](https://david-dm.org/itgalaxy/generate-robotstxt#info=devDependencies&view=table)

Awesome generator robots.txt.

## Installation

```shell
npm install generate-robotstxt
```

## Usage

```javascripts
const robotstxt = require('generate-robotstxt')

// Pass in the absolute path to your robots.txt file
robotstxt({
    policy: [
        {
            userAgent: '*',
            allow: '/'
        }
    ],
    sitemap: 'sitemap.xml',
    crawlDelay: 100,
    host: 'http://example.com',
    cleanParam: 'ref /some_dir/get_book.pl',
    dest: './'
}).then((content) => {
    console.log(content);
});
```
