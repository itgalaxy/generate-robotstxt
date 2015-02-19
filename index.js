'use strict';
var path = require('path');
var fs = require('fs');
var lodash = require('lodash');
var crypto = require('crypto');

function robotstxt(options, callback) {
    options = lodash.defaults(options || {}, {
        policy: [
            {
                userAgent: '*',
                allow: '/'
            }
        ],
        sitemap: null,
        crawlDelay: null,
        host: null,
        cleanParam: null,
        dest: process.cwd()
    });

    var addLine = function (name, rule) {
        var contents = '';
        if (Object.prototype.toString.call(name) === '[object Object]') {
            Object.keys(name).forEach(function(key) {
                var value = name[key];
                contents += addLine(key, value);
            });
        } else if (rule && Object.prototype.toString.call(rule) === '[object Array]') {
            rule.forEach(function (item) {
                contents += addLine(name, item);
            });
        } else {
            contents += capitaliseFirstLetter(name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()) + ': ' + rule + '\n';
        }
        return contents;
    };

    var capitaliseFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (function() {
        var contents = '';

        options.policy.forEach(function (item) {
            contents += addLine(item);
        });

        if (options.sitemap) {
            contents += addLine('Sitemap', options.sitemap);
        }

        if (options.host) {
            contents += addLine('Host', options.host);
        }

        if (options.crawDelay) {
            if (typeof options.crawDelay === 'number' && isFinite(options.crawDelay)) {
                contents += addLine('Crawl-delay', options.crawDelay);
            } else {
                throw new Error('gulp-robotstxt', 'Options Craw-delay must be integer or float');
            }
        }

        if (options.cleanParam) {
            contents += addLine('Clean-param', options.cleanParam);
        }

        fs.writeFile(path.join(options.dest, 'robots.txt'), contents, function (error) {
            if (callback) {
                callback(error, contents);
            } else {
                if (error) {
                    throw error;
                }
            }
        });
    })();
}

function middleware(path, options) {
    options = lodash.defaults(options || {}, {
        path: 'robots.txt',
        cache: true,
        cacheMaxAge: 86400000
    });

    var robotstxt = fs.readFileSync(path);
    if (!robotstxt) {
        throw new Error('No path provided for robots.txt file');
    }

    if (options.cache) {
        var maxAge = options.cacheMaxAge;
        var headers = {
            'Content-Type': 'text/plain',
            'Content-Length': robotstxt.length,
            'ETag': '"' + crypto.createHash('md5').update(robotstxt).digest('hex') + '"',
            'Cache-Control': 'public, max-age=' + (maxAge / 1000)
        };
    }

    return function middleware(req, res, next) {
        if ('/robots.txt' === req.url) {
            if (options.cache) {
                res.writeHead(200, headers);
            }
            res.end(robotstxt);
        } else {
            return next();
        }
    };
}

module.exports.middleware = middleware;

module.exports = robotstxt;
