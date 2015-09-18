/* global describe, it */
var should = require('should');
var generateRobotstxt = require('../index.js');
var fs = require('fs');

describe('Robots.txt', function () {
    it('should throw error if callback not function', function () {
        generateRobotstxt.bind(null, { }, null).should.throw('Callback must be function');
    });

    it('should call callback after generate and contents not empty without params', function (done) {
        generateRobotstxt(null, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).not.empty();

            return done();
        });
    });

    it('should contain one default policy without params', function (done) {
        generateRobotstxt({}, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\n');

            return done();
        });
    });

    it('should contain two policy without params', function (done) {
        generateRobotstxt({
            policy: [
                {
                    userAgent: 'Google',
                    allow: '/'
                },
                {
                    userAgent: 'Yandex',
                    allow: '/'
                }
            ]
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: Google\nAllow: /\nUser-agent: Yandex\nAllow: /\n');

            return done();
        });
    });

    it('should contain one default policy with Sitemap', function (done) {
        generateRobotstxt({
            sitemap: 'sitemap.xml'
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\nSitemap: sitemap.xml\n');

            return done();
        });
    });

    it('should contain one default policy with two Sitemaps', function (done) {
        generateRobotstxt({
            sitemap: [
                'sitemap.xml',
                'sitemap1.xml'
            ]
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\nSitemap: sitemap.xml\nSitemap: sitemap1.xml\n');

            return done();
        });
    });

    it('should contain one default policy with Host', function (done) {
        generateRobotstxt({
            host: 'http://domain.com'
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\nHost: http://domain.com\n');

            return done();
        });
    });

    it('should throw error with array of Host', function () {
        generateRobotstxt.bind(null, {
            host: [
                'http://domain.com',
                'http://domain1.com'
            ]
        }, function () {}).should.throw('Options Host must be one in robots.txt');
    });

    it('should contain one default policy with Craw-delay', function (done) {
        generateRobotstxt({
            crawDelay: 10
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\nCrawl-delay: 10\n');

            return done();
        });
    });

    it('should contain one default policy with one Clean-param', function (done) {
        generateRobotstxt({
            cleanParam: 's /forum/showthread.php'
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\nClean-param: s /forum/showthread.php\n');

            return done();
        });
    });

    it('should contain one default policy with two Clean-param', function (done) {
        generateRobotstxt({
            cleanParam: [
                's /forum/showthread.php',
                'ref /forum/showthread.php'
            ]
        }, function (error, contents) {
            if (error) {
                return done(error);
            }

            should(contents).be.equal('User-agent: *\nAllow: /\n'
                + 'Clean-param: s /forum/showthread.php\n'
                + 'Clean-param: ref /forum/showthread.php\n');

            return done();
        });
    });

    it('should throw error if Craw-delay not number', function () {
        generateRobotstxt.bind(null, {
            crawDelay: 'notNumber'
        }, function () {}).should.throw('Options Craw-delay must be integer or float');
    });

    it('should save robots.txt in destination', function (done) {
        var dest = './test/fixtures';

        generateRobotstxt({
            dest: dest
        }, function (robotsTxtError) {
            if (robotsTxtError) {
                return done(robotsTxtError);
            }

            fs.stat(dest, function (fsStatError) {
                if (fsStatError === null) {
                    return done();
                } else if (fsStatError.code === 'ENOENT') {
                    return done(new Error('File robots.txt not exist'));
                }

                return done(fsStatError);
            });
        });
    });

    it('should throw error if destination not exist', function (done) {
        generateRobotstxt({
            dest: '/test/test/test'
        }, function (error) {
            error.should.be.an.instanceof(Error);

            return done();
        });
    });

    it('should throw error if destination not string or null', function () {
        generateRobotstxt.bind(null, {
            dest: []
        }, function () {}).should.throw('Destination must be string or null');
    });
});
