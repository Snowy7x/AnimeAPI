const axios = require("axios")
const latest = async (req, res) => {
    let latestEpisodes = {
        list_type: "latest_episodes",
        _limit: req.query._limit ?? 18,
        _offset: req.query._offset ?? 0,
    }

    var config = {
        method: 'get',
        url: 'https://anslayer.com/anime/public/animes/get-published-animes',
        headers: {
            'Client-Id': 'android-app2',
            'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd'
        },

        params: {
            json: JSON.stringify(latestEpisodes)
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

module.exports = latest
