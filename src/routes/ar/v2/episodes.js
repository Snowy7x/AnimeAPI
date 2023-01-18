const axios = require("axios")
const episodes = async (req, res) => {
    if (req.query.length === 0 || !req.query.hasOwnProperty("animeId")){
        res.status(400).send("missing parameters: {animeId}")
        return;
    }

    let data = await axios.post(
        'https://anslayer.com/anime/public/episodes/get-episodes-new',
        new URLSearchParams({
            'inf': '',
            'json': '{"more_info":"No","anime_id":2571}'
        }),
        {
            headers: {
                'Client-Id': 'android-app2',
                'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd',
                'Connection': 'Keep-Alive',
                'User-Agent': 'okhttp/3.12.12'
            }
        }
    ).then(function (response) {
            return {
                code: 200,
                data: response.data.response
            };
        })
        .catch(function (error) {
            console.log("ar/v2/episodes [25] Error:", error)
            return {
                code: 400,
                data: error
            }
        });
    res.status(data.code).json(data)
}

module.exports = episodes
