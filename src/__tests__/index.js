import generateRobotstxt from '../index';
import path from 'path';
import test from 'ava';

const fixturesPath = path.join(__dirname, 'fixtures');

test('default generated content', (t) => {
    t.plan(1);

    return generateRobotstxt()
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\n');

            return content;
        });
});

test('should contain two policy', (t) => {
    t.plan(1);

    return generateRobotstxt({
        policy: [{
            userAgent: 'Google',
            allow: '/'
        }, {
            userAgent: 'Yandex',
            allow: '/'
        }]
    })
        .then((content) => {
            t.is(content, 'User-agent: Google\nAllow: /\nUser-agent: Yandex\nAllow: /\n');

            return content;
        });
});

test('should throw error if `policy` is not array', (t) => {
    t.throws(generateRobotstxt({
        policy: 'string'
    }), 'Options `policy` must be array');

    t.plan(1);
});

test('should contain sitemap if `sitemap` is string', (t) => {
    t.plan(1);

    return generateRobotstxt({
        sitemap: 'sitemap.xml'
    })
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\nSitemap: sitemap.xml\n');

            return content;
        });
});

test('should contain two sitemaps if `sitemap` is array', (t) => {
    t.plan(1);

    return generateRobotstxt({
        sitemap: [
            'sitemap.xml',
            'sitemap1.xml'
        ]
    })
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\nSitemap: sitemap.xml\nSitemap: sitemap1.xml\n');

            return content;
        });
});

test('should contain host', (t) => {
    t.plan(1);

    return generateRobotstxt({
        host: 'http://domain.com'
    })
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\nHost: http://domain.com\n');

            return content;
        });
});

test('should throw error if `host` is array', (t) => {
    t.throws(generateRobotstxt({
        host: [
            'http://domain.com',
            'http://domain1.com'
        ]
    }), 'Options `host` must be one');
});

test('should contain crawl-delay', (t) => {
    t.plan(1);

    return generateRobotstxt({
        crawlDelay: 10
    })
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\nCrawl-delay: 10\n');

            return content;
        });
});

test('should throw error if `crawlDelay` is not number', (t) => {
    t.throws(generateRobotstxt({
        crawlDelay: 'notANumber'
    }), 'Options `crawlDelay` must be integer or float');
});

test('should contain one clean-param if `cleanParam` is string', (t) => {
    t.plan(1);

    return generateRobotstxt({
        cleanParam: 's /forum/showthread.php'
    })
        .then((content) => {
            t.is(content, 'User-agent: *\nAllow: /\nClean-param: s /forum/showthread.php\n');

            return content;
        });
});

test('should contain two clean-params if `cleanParam` is array', (t) => {
    t.plan(1);

    return generateRobotstxt({
        cleanParam: [
            's /forum/showthread.php',
            'ref /forum/showthread.php'
        ]
    })
        .then((content) => {
            t.is(
                content,
                'User-agent: *\nAllow: /\n'
                    + 'Clean-param: s /forum/showthread.php\n'
                    + 'Clean-param: ref /forum/showthread.php\n'
            );

            return content;
        });
});

test('should load config file', (t) => {
    t.plan(1);

    return generateRobotstxt({
        configFile: `${fixturesPath}/config.js`
    })
        .then((content) => {
            t.is(
                content,
                'User-agent: *\nAllow: /\nHost: http://some-domain.com\n'
            );

            return content;
        });
});

test('should load commonjs config file', (t) => {
    t.plan(1);

    return generateRobotstxt({
        configFile: `${fixturesPath}/config-commonjs.js`
    })
        .then((content) => {
            t.is(
                content,
                'User-agent: *\nAllow: /\nHost: http://some-some-domain.com\n'
            );

            return content;
        });
});
