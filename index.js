'use strict';

var path = require('path');
var fs = require('fs');
var lodash = require('lodash');

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
        dest: null
    });

    if (typeof callback !== 'function') {
        throw new Error('Callback must be function');
    }

    if (Array.isArray(options.host)) {
        throw new Error('Options Host must be one in robots.txt');
    }

    if (typeof options.dest !== 'string' && options.dest !== null) {
        throw new Error('Destination must be string or null');
    }

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function addLine(name, rule) {
        var contents = '';

        if (Object.prototype.toString.call(name) === '[object Object]') {
            Object.keys(name).forEach(function (key) {
                var value = name[key];

                contents += addLine(key, value);
            });
        } else if (rule && Object.prototype.toString.call(rule) === '[object Array]') {
            rule.forEach(function (item) {
                contents += addLine(name, item);
            });
        } else {
            contents += capitaliseFirstLetter(name.replace(/([a-z])([A-Z])/g, '$1-$2')
                    .toLowerCase()) + ': ' + rule + '\n';
        }
        return contents;
    }

    return (function () {
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
                throw new Error('Options Craw-delay must be integer or float');
            }
        }

        if (options.cleanParam) {
            contents += addLine('Clean-param', options.cleanParam);
        }

        if (options.dest) {
            fs.writeFile(path.join(options.dest, 'robots.txt'), contents, function (error) {
                if (error) {
                    return callback(error);
                }

                return callback(null, contents);
            });
        } else {
            return callback(null, contents);
        }
    })();
}

module.exports = robotstxt;
