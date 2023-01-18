const sites = require("../../websites.json")
const axios = require("axios")
const cheerio = require("cheerio")

module.exports = (req, res) => {
    if (req.query.title !== undefined) {
        // Scrap the anime info from the website
        const url = sites.ar.xsanime.episodeInfo.url + encodeURIComponent(req.query.title);
        axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
            }
        }).then(async response => {
            const $ = cheerio.load(response.data);
            const title = $(sites.ar.xsanime.episodeInfo.title).text().replaceAll(new RegExp(sites.ar.xsanime.episodeInfo.replaces.join("|"), "g"), "");
            const animeInfo = {
                title: title,
                stream: [],
                download: [],
                episodes: [],
                num: title.split(" ")[title.split(" ").length - 1],
                next: null,
                prev: null
            };


            // Get the anime stream links
            for (let el of $(sites.ar.xsanime.episodeInfo.streamPath)) {
                animeInfo.stream.push({
                    name: $(el).find(sites.ar.xsanime.episodeInfo.streamNamePath).text(),
                    i: $(el).attr("data-i"),
                    id: $(el).attr("data-id"),
                });
            }

            // Get the anime download links
            $(sites.ar.xsanime.episodeInfo.downloadPath).each((i, el) => {
                const name = $(el).find(sites.ar.xsanime.episodeInfo.downloadNamePath).text();
                if (name === "") {
                    return;
                }
                animeInfo.download.push({
                    name: name,
                    url: $(el).attr(sites.ar.xsanime.episodeInfo.downloadAttr)
                });
            });

            // Get next episode if there, and last:
            $(sites.ar.xsanime.episodeInfo.nextUrlPath).each((i, el) => {
                const name = $(el).attr(sites.ar.xsanime.episodeInfo.nextAttr)
                const link = $(el).attr(sites.ar.xsanime.episodeInfo.nextUrlAttr)
                if (name === sites.ar.xsanime.episodeInfo.nextAttrValue) {
                    animeInfo.next = link.replace(sites.ar.xsanime.episodeInfo.url, "");
                } else if (name === sites.ar.xsanime.episodeInfo.prevAttrValue) {
                    animeInfo.prev = link.replace(sites.ar.xsanime.episodeInfo.url, "");
                }
            })


            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(animeInfo));
        }).catch(error => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            console.log(error)
            res.end(JSON.stringify({
                error: error.message,
                url: url
            }));
        })
    } else {
        res.end("No anime specified");
    }

}
