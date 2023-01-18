const puppeteer = require("puppeteer");
const cheerio = require("cheerio")
const http = require("http");
const axios = require("axios");
const fetch = require("cross-fetch");

async function streamtap(url) {
    console.log(url)
    return await fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "_b=kube18; _csrf=32670860281e29a33430db07ec8ba2428f08046db7535eea8e5cb31d2ef02ba9a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22dsKnhmooYGsaGbdmNl90wDugrywebrpQ%22%3B%7D"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then((response) => response).then((result) => {
        return result.url
    });
}

function Uqload(req, res, html) {
    const $ = cheerio.load(html);

    try {
        for (var i = 0; i < $('script[type="text/javascript"]').get().length; i++) {
            const text = $('script[type="text/javascript"]').get(i);
            try {
                const s = text.children[0].data;
                if (s.includes("sources:")) {
                    var json = s.split("[")[1].split("]")[0];
                    json = JSON.parse("[" + json + "]");
                    mp4 = json[0];
                    break;
                }
            } catch (rt) { }
        }

        if (mp4 == null || mp4 == '') {
            mp4 = null;
        }
    } catch (e) {
        mp4 = mp4 == null ? '' : mp4;
    }

    mp4 = mp4 == null ? '' : mp4;

    res.send({ status: mp4 == '' ? 'error' : 'ok', url: mp4 });
}

async function linkBox(url) {
    console.log(url)
    const response = await axios.get("https://www.linkbox.to/api/open/get_url?itemId=" + url.split("id=")[1])
    return response.data.data.url;
}

module.exports = async (req, res) => {
    const url = req.query.url
    if (url === undefined) {
        res.status(405).end('You must provide: a url');
    } else {
        let src;
        if (url.includes("linkbox")) {
            src = await linkBox(url);

        } else {
            const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']})
            const page = await browser.newPage()
            await page.goto(url, {waitUntil: "domcontentloaded"})
            const data = await page.evaluate(() => {
                return document.body.innerHTML;
            })

            const $ = cheerio.load(data)
            if (url.includes("uqload")) {
                await browser.close()
                Uqload(req, res, $.html())
                return
            }
            if (url.includes("streamtape")) {
                src = await streamtap("http:" + $("#robotlink").text() + "&stream=1")
            } else {
                const video = $("video")
                if (video.length < 1) {
                    res.end(JSON.stringify({
                        code: 400,
                        message: "Could not find video element..."
                    }))
                } else {
                    src = video.attr("src") != null && video.attr("src") !== "" ? video.attr("src") : video.find("source").attr("src")
                }
            }
            await browser.close()
        }

        res.end(JSON.stringify({
            code: 200,
            src
        }))
    }
}
function getVideoURL(embed_url, callback) {
    http.get(embed_url, (res) => {
        const {
            statusCode
        } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                let video_url = rawData.split('sources: ["')[1].split('"')[0];
                let filename = rawData.split("chromecast: { media: {title: \"")[1].split('"')[0] + ".mp4";
                callback(video_url, filename);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}