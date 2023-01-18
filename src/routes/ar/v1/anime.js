const websites = require("../../websites.json")
const axios = require("axios")
const cheerio = require("cheerio")


module.exports = (req, res) => {
    if (req.query.title !== undefined) {
        // Scrap the anime info from the website
        axios.get(websites.ar.xsanime.animeInfo.url + req.query.title, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
            }
        }).then(response => {
            const $ = cheerio.load(response.data);
            const animeInfo = {
                title: $(websites.ar.xsanime.animeInfo.titlePath).text().replaceAll("\n", ""),
                img: $(websites.ar.xsanime.animeInfo.coverPath).attr("src"),
                description: $(websites.ar.xsanime.animeInfo.descriptionPath).text().replaceAll("xsanime", "snowyanime"),
                stats: [],
                genres: [],
                episodes: []
            };
            // Get the anime stats
            $(websites.ar.xsanime.animeInfo.statsPath).slice(1, websites.ar.xsanime.animeInfo.statsCount).each((i, el) => {
                animeInfo.stats.push({
                    name: $(el).find(websites.ar.xsanime.animeInfo.statsNamePath).text(),
                    value: $(el).text().replace($(el).find(websites.ar.xsanime.animeInfo.statsNamePath).text(), "").trim()
                });
            });
            $(websites.ar.xsanime.animeInfo.genrePath).each((i, el) => {
                animeInfo.genres.push($(el).text());
            });
            // Scrap the episodes info from the website
            let img;
            $(websites.ar.xsanime.animeInfo.episodesPath).each((i, el) => {
                if (i === 0) {
                    img = animeInfo.img
                }
                const episodeNumber = $(el).find(websites.ar.xsanime.animeInfo.ep_numPath).text().replace(/^\D+/g, '')
                const episodeUrl = $(el).attr(websites.ar.xsanime.animeInfo.ep_urlAttr).replace(websites.ar.xsanime.episodeInfo.url, "");
                animeInfo.episodes.push({
                    img,
                    episodeNumber,
                    episodeUrl
                });
            });

            animeInfo.episodes = animeInfo.episodes.reverse()

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(animeInfo));
        }).catch(error => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: error.message
            }));
        })
    } else {
        res.end("No anime specified");
    }
}
