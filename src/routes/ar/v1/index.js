const express = require("express")
let router = express.Router();
const latest = require("./latest")
const anime = require("./anime")
const episode = require("./episode")
const stream = require("./stream")
const video = require("./videoUrl")

router.get("/latest", latest)
router.get("/anime", anime)
router.get("/episode", episode)
router.get("/stream", stream)
router.get("/video_url", video)

module.exports = router;