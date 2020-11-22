const Crawler = require("crawler");
const mongoose = require('mongoose');
const webpage = require("./Webpage")
const psl = require('psl');
const robots = require('robots')
const parser = new robots.RobotsParser();
const c = new Crawler();

var crawllist = ["https://wikipedia.com", "https://facebook.com", "https://twitter.com", "https://apple.com"]

for (i = 0; i < crawllist.length; i++) {
    crawl(crawllist[i])
}

mongoose.connect('mongodb://localhost/search-engine-crawler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

function crawl(url) {
    // console.log(`Crawling ${url}`);
    c.queue({
        uri: url,
        userAgent: "Mozilla/5.0 (compatible; OSSBot/1.0; +http://github.com/mr-winson/search-engine/crawler/about.md)",
        callback: function (err, res, done) {
            if (err) throw err;
            let $ = res.$;

            try {
                var title
                var description
                var host

                host = hostname(url);

                let tempurl = new URL(url)
                let pathandQuery = tempurl.pathname + tempurl.search;

                parser.setUrl(`https://${host}/robots.txt`, function (parser, success) {
                    if (success) {
                        parser.canFetch('Mozilla/5.0 (compatible; OSSBot/1.0; +http://github.com/mr-winson/search-engine/crawler/about.md)', pathandQuery, function (access) {
                            console.log(pathandQuery)
                            if (access == false) {
                                return console.log(`robots.txt denied acces to ${pathandQuery}`)
                            } else {
                                title = $("title").text()

                                description = $("meta[name='description']").attr("content");

                                if (title == "" || title == undefined) {
                                    title = "No title was provided."
                                }

                                if (description == "" || description == undefined) {
                                    description = "No description was provided."
                                }

                                if (host == "" || host == undefined) {
                                    host = "A hostname was not found."
                                }

                                createindex(url, description, title, host)

                                let urls = $("a");
                                Object.keys(urls).forEach((item) => {
                                    if (urls[item].type === 'tag') {
                                        let href = urls[item].attribs.href;
                                        if (href) {
                                            href = href.trim();
                                            setTimeout(function () {
                                                href.startsWith('http') ? crawl(href) : crawl(`${url}${href}`) // The latter might need extra code to test if its the same site and it is a full domain with no URI
                                            }, 5000)
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

            } catch (e) {
                console.error(`Encountered an error crawling ${url}. Aborting crawl. ${e}`);
                done()

            }
            done();
        }
    })
}

async function createindex(url, description, title, host) {
    const exists = await webpage.exists({
        url: url
    })
    if (exists == true) {
        const oldindexedpage = await webpage.findOne({
            url: url
        })

        const updateindexcrawlcount = await webpage.findOneAndUpdate({
            url: url
        }, {
            timescrawled: oldindexedpage.timescrawled + 1
        })

        updateindexcrawlcount
    } else {
        if (host == "") {
            return console.log("hostname was not defined")
        }
        const newindex = new webpage({
            url: url,
            description: description,
            title: title,
            host: host,
            timescrawled: 1
        })

        newindex.save().then(indexedpage => {
            console.log(`Created index for ${indexedpage.url}`)
        })
    }
}

function hostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}