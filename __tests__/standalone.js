import path from "path";
import generateRobotstxt from "../src/standalone";

const fixturesPath = path.join(__dirname, "fixtures");

describe("standalone", () => {
  it("should generated default output without options", async () => {
    await expect(generateRobotstxt()).resolves.toMatchSnapshot();
  });

  it("should contain one `policy` item with the `Allow` directive", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            userAgent: "Google"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain one `policy` items with the `Allow` directive", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: ["/", "/foobar"],
            userAgent: "Google"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain one `policy` items with the `Disallow` directive", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            disallow: ["/", "/foobar"],
            userAgent: "Google"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain two `policy` item with the `Allow` directive", async () => {
    await expect(
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
      })
    ).resolves.toMatchSnapshot();
  });

  it("should `contain two `policy` item with the `Allow` and the `Disallow` directives", async () => {
    await expect(
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
      })
    ).resolves.toMatchSnapshot();
  });

  it("should `contain two policy item, first have multiple `User-agent` option", async () => {
    await expect(
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
      })
    ).resolves.toMatchSnapshot();
  });

  it("should use encode url in the `allow` and the `disallow` options", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/корзина",
            disallow: "/личный-кабинет",
            userAgent: "Google"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error if the `policy` option is string", async () => {
    await expect(
      generateRobotstxt({
        policy: "string"
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `policy` option is null", async () => {
    await expect(
      generateRobotstxt({
        policy: null
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `policy` option not have the `userAgent` option", async () => {
    await expect(
      generateRobotstxt({
        policy: [{}]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `policy` option have array the `userAgent` option", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            userAgent: []
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should contain the `Sitemap` directive", async () => {
    await expect(
      generateRobotstxt({
        sitemap: "http://foobar.com/sitemap.xml"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error if the `sitemap` option is not string or array", async () => {
    await expect(
      generateRobotstxt({
        sitemap: {}
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `sitemap` option is not absolute URL", async () => {
    await expect(
      generateRobotstxt({
        sitemap: "sitemap.xml"
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if item in the `sitemap` option not an absolute URL", async () => {
    await expect(
      generateRobotstxt({
        sitemap: ["sitemap.xml"]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if item in the `sitemap` option not a string or an array", async () => {
    await expect(
      generateRobotstxt({
        sitemap: [{}]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should `contain two `Sitemap` directives", async () => {
    await expect(
      generateRobotstxt({
        sitemap: [
          "http://foobar.com/sitemap.xml",
          "http://foobar.com/sitemap1.xml"
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should `contain the `Host`", async () => {
    await expect(
      generateRobotstxt({
        host: "http://domain.com"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain the `Host` without a trailing slash", async () => {
    await expect(
      generateRobotstxt({
        host: "http://domain.com/"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain the `Host` in punycode format", async () => {
    await expect(
      generateRobotstxt({
        host: "интернет-магазин.рф"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain the `Host` without `80` port", async () => {
    await expect(
      generateRobotstxt({
        host: "domain.com:80"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain the `Host` if `host` options without protocol scheme", async () => {
    await expect(
      generateRobotstxt({
        host: "www.domain.com"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error on invalid `host` option", async () => {
    await expect(
      generateRobotstxt({
        host: "?:foobar"
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `host` option being IP address version 4", async () => {
    await expect(
      generateRobotstxt({
        host: "127.0.0.1"
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `host` option being IP address version 6", async () => {
    await expect(
      generateRobotstxt({
        host: "0:0:0:0:0:0:7f00:1"
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should contain the `Host` with `https` scheme", async () => {
    await expect(
      generateRobotstxt({
        host: "https://domain.com"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain the `Host` without any extra URL entire", async () => {
    await expect(
      generateRobotstxt({
        host: "http://www.domain.com:8080/foo/bar/foobar.php?foo=bar#foobar"
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error if the `Host` option is array", async () => {
    await expect(
      generateRobotstxt({
        host: ["http://domain.com", "http://domain1.com"]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should contain multiple `User-agent` and `Crawl-delay`", async () => {
    await expect(
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
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error on invalid `crawlDelay` option", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            crawlDelay: "foo",
            userAgent: "Google"
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should contain one policy item with one `Clean-param` option", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: "s /forum/showthread.php",
            userAgent: "Yandex"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain one policy item with two `Clean-params` options", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: [
              "s /forum/showthread.php",
              "ref /forum/showthread.php"
            ],
            userAgent: "Yandex"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error if the `cleanParam` option more than 500 characters", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: new Array(502).join("a"),
            userAgent: "Yandex"
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the item in `cleanParam` option more than 500 characters", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: [new Array(502).join("a")],
            userAgent: "Yandex"
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the `cleanParam` option not string or array", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: {},
            userAgent: "Yandex"
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if the item in `cleanParam` option not string", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: [{}],
            userAgent: "Yandex"
          }
        ]
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("config option", async () => {
    await expect(
      generateRobotstxt({
        configFile: path.join(fixturesPath, "robots-txt.config.js")
      })
    ).resolves.toMatchSnapshot();
  });

  it("should throw error if config don't found", async () => {
    await expect(
      generateRobotstxt({
        configFile: path.join(fixturesPath, "not-found.config.js")
      })
    ).rejects.toThrow(/no such file or directory/);
  });

  it("should load a config file", async () => {
    const oldProcessCwd = process.cwd();

    process.chdir(fixturesPath);

    const context = await generateRobotstxt();

    expect(context).toMatchSnapshot();

    process.chdir(oldProcessCwd);
  });

  it("should contain two `policy` items with empty `Disallow` directive", async () => {
    await expect(
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
      })
    ).resolves.toMatchSnapshot();
  });

  it("should contain one policy item without empty `Clean-param` option", async () => {
    await expect(
      generateRobotstxt({
        policy: [
          {
            allow: "/",
            cleanParam: [],
            userAgent: "Yandex"
          }
        ]
      })
    ).resolves.toMatchSnapshot();
  });
});
