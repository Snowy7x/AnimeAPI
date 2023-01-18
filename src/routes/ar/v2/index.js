const express = require("express")
let router = express.Router();

/*
"Value must be one of: latest_episodes, custom_list, anime_list, currently_airing, latest_updated_episode,
 latest_updated_episode_new, top_anime, top_currently_airing, top_tv, top_movie, featured,
 filter, favorites, watching, plan_to_watch, watched, dropped, on_hold, watched_history,
 schedule, last_added_tv, last_added_movie, top_anime_mal, top_currently_airing_mal,
 top_tv_mal, top_movie_mal, anime_characters, top_upcoming, top_upcoming_catalog"
 */

 /*
 Orderby: latest_first, earliest_first, anime_name_asc, anime_name_desc, anime_year_asc, anime_year_desc, anime_rating_desc, best_match, mal_rank_asc
 */

/*
    anime_season: Winter, Fall, Spring, Summer
    anime_name: "Naruto",
    anime_type: "TV, ONA, OVA, Movie, Music, Special"
    anime_release_years: "2015, 2010"
    genres:
    1: اكشن,
    2: مغامرات,
    3: سيارات,
    4: كوميديا,
    5: جنون,
    6: شياطين,
    7: غموض,
    8: دراما,
    9: ايتشي,
    10: خيال,
    11: العاب,
    12: تاريخي,
    13: رعب,
    14: اطفال,
    15: سحر,
    16: فنون قتالية,
    17: ميكا,
    18: موسيقى,
    19: محاكاة ساخرة,
    20: ساموراي,
    21: رومانسي,
    22: مدرسي,
    23: خيال علميm
    24: شوجو,
    25: شونين,
    26: فضاء,
    27: رياضي,
    28: قوى خارقة,
    29: مصاص دماء,
    30: حريم,
    31: شريحة من الحياة,
    32: خارق للطبيعة,
    33: عسكري,
    34: بوليس,
    35: نفسي,
    36: اثارة,
    37: سينين,
    38: جوسي,
    39: ايسيكاي
*/


router.get("/latest", require("./latest"))
router.get("/anime", require("./anime"))
router.get("/search", require("./search"))
router.get("/episodes", require("./episodes"))
router.get("/servers", require("./servers"))
router.post("/episode", require("./episode"))
router.post("/episode", require("./episode"))
router.post("/schedule", require("./schedule"))

module.exports = router;

const axios = require("axios");
const first = () => {
    let latestAddedAnimes = {
        "_offset": 0,
        "_limit": 30,
        "_order_by": "name",
        "list_type": "filter",
        "just_info": "Yes"
    }

    let latestEpisodes = {
        list_type: "latest_episodes"
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

    axios(config)
        .then(function (response) {
            console.log(response.data.response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}

const second = () => {

    let AnimeDetails = {
        anime_id: "2594",
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

    axios(config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}

const third = () => {
    let AnimeDetails = {
        'n': 'shingeki_no_kyojin_the_final_season_part_2\\1',
        'inf': ''
    }

    var config = {
        method: 'post',
        url: 'https://anslayer.com/la/public/api/fw',
        headers:  {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'Keep-Alive',
        },
        params: AnimeDetails
    };

    axios(config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}
