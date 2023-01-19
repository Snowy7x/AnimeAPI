const axios = require("axios")
var RNCryptor = require('rncryptor-node');
const {Decoder} = require("./decoder");

const episode = async (req, res) => {
    if (req.query.length === 0 || !req.query.hasOwnProperty("animeId")){
        res.status(400).send("missing parameters: {animeId}")
        return;
    }
    if (req.query.length === 0 || !req.query.hasOwnProperty("episodeId")){
        res.status(400).send("missing parameters: {episodeId}")
        return;
    }
    /*let c = await axios.post("https://www.mediafire.com/file/rebkxbx43re7jd8")
    let i = Decoder.decode("https://www.mediafire.com/file/rebkxbx43re7jd8", c.data)
    res.json({})
    return;*/
    let data = await axios.post(
        'https://anslayer.com/anime/public/episodes/get-episodes-new',
        new URLSearchParams({
            'inf': '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}',
            'json': `{"anime_id":${req.query.animeId},"episode_id":"${req.query.episodeId}"}`
        }),
        {
            headers: {
                'Client-Id': 'android-app2',
                'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd',
                'Accept': 'application/json, application/*+json',
                'Host': 'anslayer.com',
                'User-Agent': 'okhttp/3.12.12'
            }
        }
    ) .then(function (response) {
            return {
                code: 200,
                data: response.data.response.data[0]
            };
        })
        .catch(function (error) {
            console.log("ar/v2/episode [41] Error:", error.message)
            return {
                code: 400,
                data: error.message,
            }
        });
    if (data.code !== 200){
        res.status(400).json(data)
        return
    }
        const urls = data.data.episode_urls
    let servers = []
    if (urls) {
        const normal_servers = await axios.post(
            'https://anslayer.com/la/public/api/fw',
            new URLSearchParams({
                'n': urls[1].episode_url.replace("https://anslayer.com/la/public/api/f2?n=", ""),
                'inf': '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}'
            }),
            {
                headers: {
                    'User-Agent': 'okhttp/3.12.12',
                    'Host': 'anslayer.com'
                }
            }
        ).then((re) => re.data)

        for (let s of normal_servers) {
            let c = await axios.post(s).catch(err => {
                return null
            })
            if (c === null) continue
            let i = Decoder.decode(s, c.data)
            if (i) {
                let json = JSON.parse(i)
                if (json.urls.length >= 1){
                    servers.push(json)
                }
            }
        }

        const url_ = new URL(urls[0].episode_url)
        const params_ = url_.searchParams

        const og_urls = await axios.post(
            'https://anslayer.com/anime/public/v-qs.php',
            new URLSearchParams({
                'f': params_.get('f'),
                'e': params_.get('e'),
                'inf': '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}'
            }),
            {
                headers: {
                    'User-Agent': 'okhttp/3.12.12',
                    'Host': 'anslayer.com'
                }
            }
        ).then(re => {
            let decrypted = RNCryptor.Decrypt(re.data, "android-app9>E>VBa=X%;[5BX~=Q~K");
            let js = JSON.parse(decrypted.toString())
            for (let i in js) {
                let link = js[i].file
                js[i].label = link.includes("h.mp4") ? "1080p" : link.includes("m.mp4") ? "720p" : link.includes("s.mp4") ? "480p" : "av"
                js[i].file = "http://31.187.75.164:3069/ar/v2/proxy?url=" + encodeURIComponent(js[i].file);
            }
            return js
        });

        servers.push({
            type: -1,
            url: "https://anslayer.com",
            host: "www.custom.com",
            urls: og_urls,
        })
    }

    for (let ind in servers) {
        let host = servers[ind].host;
        servers[ind].type = ind;
        servers[ind]["shorten"] = host.replace("www.", "").replace(".com", '').replace(".net", '')
    }

    res.status(data.code).json({
        servers,
        ...data.data
    })
}

module.exports = episode
