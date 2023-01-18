const fetch = require("cross-fetch")
async function streamtap(url) {
    let url_ = await fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "_b=kube18; _csrf=32670860281e29a33430db07ec8ba2428f08046db7535eea8e5cb31d2ef02ba9a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22dsKnhmooYGsaGbdmNl90wDugrywebrpQ%22%3B%7D"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then((response) => response).then((result) => {
        return result.url
    });
    return url_;
}

streamtap("https://streamtape.com/get_video?id=KA6dzb3vD0T0YAa&expires=1673306672&ip=F0OQKRWZEI9XKxR&token=mNdBWWdLuhkE&stream=1").then(url => console.log("url: ", url))