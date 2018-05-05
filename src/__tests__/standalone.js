import generateRobotstxt from "../standalone";
import path from "path";
// eslint-disable-next-line node/no-unpublished-import
import test from "ava";

const fixturesPath = path.join(__dirname, "fixtures");

test("should generated default output without options", t =>
  generateRobotstxt().then(content => {
    t.is(content, "User-agent: *\nAllow: /\n");
  }));

test("should contain one `policy` item with the `Allow` directive", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        userAgent: "Google"
      }
    ]
  }).then(content => {
    t.is(content, "User-agent: Google\nAllow: /\n");
  }));

test("should contain one `policy` items with the `Allow` directive", t =>
  generateRobotstxt({
    policy: [
      {
        allow: ["/", "/foobar"],
        userAgent: "Google"
      }
    ]
  }).then(content => {
    t.is(content, "User-agent: Google\nAllow: /\nAllow: /foobar\n");
  }));

test("should contain one `policy` items with the `Disallow` directive", t =>
  generateRobotstxt({
    policy: [
      {
        disallow: ["/", "/foobar"],
        userAgent: "Google"
      }
    ]
  }).then(content => {
    t.is(content, "User-agent: Google\nDisallow: /\nDisallow: /foobar\n");
  }));

test("should contain two `policy` item with the `Allow` directive", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        userAgent: "Google"
      },
      {
        allow: "/",
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Google\nAllow: /\n\nUser-agent: Yandex\nAllow: /\n"
    );
  }));

test("should `contain two `policy` item with the `Allow` and the `Disallow` directives", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        disallow: "/search-foo",
        userAgent: "Google"
      },
      {
        allow: "/",
        disallow: "/search-bar",
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Google\nAllow: /\nDisallow: /search-foo\n\n" +
        "User-agent: Yandex\nAllow: /\nDisallow: /search-bar\n"
    );
  }));

test("should `contain two policy item, first have multiple `User-agent` option", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        disallow: "/search-foo",
        userAgent: ["Google", "AnotherBot"]
      },
      {
        allow: "/",
        disallow: "/search-bar",
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Google\nUser-agent: AnotherBot\nAllow: /\nDisallow: /search-foo\n\n" +
        "User-agent: Yandex\nAllow: /\nDisallow: /search-bar\n"
    );
  }));

test("should use encode url in the `allow` and the `disallow` options", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/корзина",
        disallow: "/личный-кабинет",
        userAgent: "Google"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Google\n" +
        "Allow: /%D0%BA%D0%BE%D1%80%D0%B7%D0%B8%D0%BD%D0%B0\n" +
        "Disallow: /%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B9-%D0%BA%D0%B0%D0%B1%D0%B8%D0%BD%D0%B5%D1%82\n"
    );
  }));

test("should throw error if the `policy` option is string", t =>
  t.throws(
    generateRobotstxt({
      policy: "string"
    }),
    "Options `policy` must be array"
  ));

test("should throw error if the `policy` option is null", t =>
  t.throws(
    generateRobotstxt({
      policy: null
    }),
    "Options `policy` should be define"
  ));

test("should throw error if the `policy` option not have the `userAgent` option", t =>
  t.throws(
    generateRobotstxt({
      policy: [{}]
    }),
    "Each `policy` should have a single string `userAgent` option"
  ));

test("should throw error if the `policy` option have array the `userAgent` option", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          userAgent: []
        }
      ]
    }),
    "Each `policy` should have a single string `userAgent` option"
  ));

test("should contain the `Sitemap` directive", t =>
  generateRobotstxt({
    sitemap: "http://foobar.com/sitemap.xml"
  }).then(content => {
    t.is(
      content,
      "User-agent: *\nAllow: /\nSitemap: http://foobar.com/sitemap.xml\n"
    );
  }));

test("should throw error if the `sitemap` option is not string or array", t =>
  t.throws(
    generateRobotstxt({
      sitemap: {}
    }),
    "Option `sitemap` should be a string or an array"
  ));

test("should throw error if the `sitemap` option is not absolute URL", t =>
  t.throws(
    generateRobotstxt({
      sitemap: "sitemap.xml"
    }),
    "Option `sitemap` should be an absolute URL"
  ));

test("should throw error if item in the `sitemap` option not a string or an array", t =>
  t.throws(
    generateRobotstxt({
      sitemap: [{}]
    }),
    "Item in `sitemap` option should be a string"
  ));

test("should `contain two `Sitemap` directives", t =>
  generateRobotstxt({
    sitemap: ["http://foobar.com/sitemap.xml", "http://foobar.com/sitemap1.xml"]
  }).then(content => {
    t.is(
      content,
      "User-agent: *\nAllow: /\n" +
        "Sitemap: http://foobar.com/sitemap.xml\nSitemap: http://foobar.com/sitemap1.xml\n"
    );
  }));

test("should throw error if item in the `sitemap` option not an absolute URL", t =>
  t.throws(
    generateRobotstxt({
      sitemap: ["sitemap.xml"]
    }),
    "Item in `sitemap` option should be an absolute URL"
  ));

test("should `contain the `Host`", t =>
  generateRobotstxt({
    host: "http://domain.com"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: domain.com\n");
  }));

test("should contain the `Host` without a trailing slash", t =>
  generateRobotstxt({
    host: "http://domain.com/"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: domain.com\n");
  }));

test("should contain the `Host` in punycode format", t =>
  generateRobotstxt({
    host: "интернет-магазин.рф"
  }).then(content => {
    t.is(
      content,
      "User-agent: *\nAllow: /\nHost: xn----8sbalhasbh9ahbi6a2ae.xn--p1ai\n"
    );
  }));

test("should contain the `Host` without `80` port", t =>
  generateRobotstxt({
    host: "domain.com:80"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: domain.com\n");
  }));

test("should contain the `Host` if `host` options without protocol scheme", t =>
  generateRobotstxt({
    host: "www.domain.com"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: www.domain.com\n");
  }));

test("should throw error on invalid `host` option", t =>
  t.throws(
    generateRobotstxt({
      host: "?:foobar"
    }),
    "Option `host` does not contain correct host"
  ));

test("should throw error if the `host` option being IP address version 4", t =>
  t.throws(
    generateRobotstxt({
      host: "127.0.0.1"
    }),
    "Options `host` should be not an IP address"
  ));

test("should throw error if the `host` option being IP address version 6", t =>
  t.throws(
    generateRobotstxt({
      host: "0:0:0:0:0:0:7f00:1"
    }),
    "Options `host` should be not an IP address"
  ));

test("should contain the `Host` with `https` scheme", t =>
  generateRobotstxt({
    host: "https://domain.com"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: https://domain.com\n");
  }));

test("should contain the `Host` without any extra URL entire", t =>
  generateRobotstxt({
    host: "http://www.domain.com:8080/foo/bar/foobar.php?foo=bar#foobar"
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: www.domain.com:8080\n");
  }));

test("should throw error if the `Host` option is array", t =>
  t.throws(
    generateRobotstxt({
      host: ["http://domain.com", "http://domain1.com"]
    }),
    "Options `host` must be only one string"
  ));

test("should contain multiple `User-agent` and `Crawl-delay`", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        crawlDelay: 10,
        userAgent: "Google"
      },
      {
        allow: "/",
        crawlDelay: 0.5,
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Google\nAllow: /\nCrawl-delay: 10\n\nUser-agent: Yandex\nAllow: /\nCrawl-delay: 0.5\n"
    );
  }));

test("should throw error on invalid `crawlDelay` option", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          allow: "/",
          crawlDelay: "foo",
          userAgent: "Google"
        }
      ]
    }),
    "Option `crawlDelay` must be an integer or a float"
  ));

test("should contain one policy item with one `Clean-param` option", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        cleanParam: "s /forum/showthread.php",
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Yandex\nAllow: /\nClean-param: s /forum/showthread.php\n"
    );
  }));

test("should contain one policy item with two `Clean-params` options", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        cleanParam: ["s /forum/showthread.php", "ref /forum/showthread.php"],
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(
      content,
      "User-agent: Yandex\nAllow: /\n" +
        "Clean-param: s /forum/showthread.php\n" +
        "Clean-param: ref /forum/showthread.php\n"
    );
  }));

test("should throw error if the `cleanParam` option more than 500 characters", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          allow: "/",
          cleanParam: new Array(502).join("a"),
          userAgent: "Yandex"
        }
      ]
    }),
    "Option `cleanParam` should have no more than 500 characters"
  ));

test("should throw error if the item in `cleanParam` option more than 500 characters", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          allow: "/",
          cleanParam: [new Array(502).join("a")],
          userAgent: "Yandex"
        }
      ]
    }),
    "String in `cleanParam` option should have no more than 500 characters"
  ));

test("should throw error if the `cleanParam` option not string or array", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          allow: "/",
          cleanParam: {},
          userAgent: "Yandex"
        }
      ]
    }),
    "Option `cleanParam` should be a string or an array"
  ));

test("should throw error if the item in `cleanParam` option not string", t =>
  t.throws(
    generateRobotstxt({
      policy: [
        {
          allow: "/",
          cleanParam: [{}],
          userAgent: "Yandex"
        }
      ]
    }),
    "String in `cleanParam` option should be a string"
  ));

test("config option", t =>
  generateRobotstxt({
    configFile: path.join(fixturesPath, "robots-txt.config.js")
  }).then(content => {
    t.is(content, "User-agent: *\nAllow: /\nHost: some-some-domain.com\n");
  }));

test("should throw error if config don't found", t =>
  t.throws(
    generateRobotstxt({
      configFile: path.join(fixturesPath, "not-found.config.js")
    }).then(content => {
      t.is(content, "User-agent: *\nAllow: /\nHost: some-some-domain.com\n");
    })
  ));

test.serial("should load a config file", t => {
  const oldProcessCwd = process.cwd();

  process.chdir(fixturesPath);

  return generateRobotstxt()
    .then(content => {
      t.is(content, "User-agent: *\nAllow: /\nHost: some-some-domain.com\n");
    })
    .then(() => {
      process.chdir(oldProcessCwd);

      return Promise.resolve();
    });
});

test("should contain two `policy` items with empty `Disallow` directive", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "",
        disallow: "",
        userAgent: "*"
      },
      {
        allow: "",
        disallow: [""],
        userAgent: "Foo"
      }
    ]
  }).then(content => {
    t.is(content, "User-agent: *\nDisallow:\n\nUser-agent: Foo\nDisallow:\n");
  }));

test("should contain one policy item without empty `Clean-param` option", t =>
  generateRobotstxt({
    policy: [
      {
        allow: "/",
        cleanParam: [],
        userAgent: "Yandex"
      }
    ]
  }).then(content => {
    t.is(content, "User-agent: Yandex\nAllow: /\n");
  }));
