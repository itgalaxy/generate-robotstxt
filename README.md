generate-robotstxt
==================

Generator robots.txt for node js and middleware for express/connect framework.

## Installation

    npm install generate-robotstxt

## Usage generate

    var robotstxt = require('generate-robotstxt')

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
    }, callback)

