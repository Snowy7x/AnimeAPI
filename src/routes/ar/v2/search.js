const axios = require("axios")
const search = async (req, res) => {
    let latestAddedAnimes = {
        "_offset": req.query._offset ?? 0,
        "_limit": req.query._limit ?? 18,
        "_order_by":"anime_year_desc",
        "list_type":"filter",
        "just_info":"Yes",
        "anime_name": req.query.query ?? "",
        "anime_type": req.query.type ?? "",
        "anime_release_years": req.query.years ?? "",
        "anime_season": req.query.season ?? "",
        "anime_genre_ids": req.query.genres ?? "",
    }

    var config = {
        method: 'get',
        url: 'https://anslayer.com/anime/public/animes/get-published-animes',
        headers: {
            'Client-Id': 'android-app2',
            'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd'
        },

        params: {
            json: JSON.stringify(latestAddedAnimes)
        }
    };

    let data = await axios(config)
        .then(function (response) {
            return {
                code: 200,
                data: response.data.response.data
            };
        })
        .catch(function (error) {
            console.log("ar/v2/Latest [29] Error:", error)
            return {
                code: 400,
                data: error
            }
        });
    res.status(data.code).json(data)
}

module.exports = search
