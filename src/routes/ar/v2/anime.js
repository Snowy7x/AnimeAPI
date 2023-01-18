const axios = require("axios")
const anime = async (req, res) => {
    if (req.query.length === 0 || !req.query.hasOwnProperty("animeId")){
        res.status(400).send("missing parameters: {animeId}")
        return;
    }
    let AnimeDetails = {
        anime_id: req.query.animeId,
        fetch_episodes: "Yes",
        more_info: "Yes"
    }

    var config = {
        method: 'get',
        url: 'https://anslayer.com/anime/public/anime/get-anime-details',
        headers: {
            'Client-Id': 'android-app2',
            'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd'
        },

        params: AnimeDetails
    };
    let data = await axios(config)
        .then(function (response) {
            return {
                code: 200,
                data: response.data.response
            };
        })
        .catch(function (error) {
            console.log("ar/v2/anime [31] Error:", error)
            return {
                code: 400,
                data: error
            }
        });
    res.status(data.code).json(data)
}

module.exports = anime
