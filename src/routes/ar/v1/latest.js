const websites = require("../../websites.json")
const axios = require("axios")
const cheerio = require("cheerio")

module.exports = (req, res) => {
    const site = websites.ar.xsanime;
    const url = site.latest.url;
    if (!url) {
        res.status(400).json({
            statusCode: 400,
            message: "Could not fetch database."
        });
        return;
    }

    const page = site.latest.hasNum ? Math.round((req.query.page ?? 1) / 2) : "";
    const urlWithPage = url + page;
    axios.get(urlWithPage).then(response => {
        const $ = cheerio.load(response.data);
        const episodes = [];
        let animeCards = $(site.latest.path);
        // @ts-ignore
        if (req.query.page % 2 !== 0) {
            animeCards = animeCards.slice(0, animeCards.length / 2);
        } else {
            animeCards = animeCards.slice(animeCards.length / 2, animeCards.length);
        }
        animeCards.each((i, el) => {
            const title = $(el).find(site.latest.titlePath).text();
            const img = $(el).find(site.latest.imgPath).attr("src");
            const episodeNumber = $(el).find(site.latest.episodeNumPath).text().replace(/^\D+/g, '');

            const url = $(el).find(site.latest.episodeUrlPath).attr("href");
            //@ts-ignore
            const animeUrl = url?.replace(site.episodeInfo.url, "").replace(site.animeInfo.murl);
            //@ts-ignore
            const episodeUrl = url?.replace(site.episodeInfo.url, "").replace(site.animeInfo.murl);

            const isMovie = url?.includes("movie")

            episodes.push({
                title,
                img,
                episodeNumber,
                animeUrl,
                episodeUrl,
                isMovie
            });
        });
        res.json(episodes);
    }).catch((error) => {
        res.statusCode = 400
        res.json({
            error: error.message,
            url: urlWithPage
        })
    });

}