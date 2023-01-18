const axios = require('axios');

const schedule = async (req, res) => {

    const response = await axios.get('https://anslayer.com/anime/public/animes/get-published-animes', {
        params: {
            'json': '{"list_type":"schedule"}'
        },
        headers: {
            'Client-Id': 'android-app2',
            'Client-Secret': '7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd',
            'Accept': 'application/json, application/*+json',
            'Connection': 'Keep-Alive',
            'User-Agent': 'okhttp/3.12.12'
        }
    });

    res.send(response.data.response.data)
}

module.exports = schedule
