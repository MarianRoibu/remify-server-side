const express = require("express");
const router = express.Router();
const cors = require('cors');

const { getAllGifPublicController} = require("../controllers");

const { getAllGifs  } = getAllGifPublicController;

router.use(cors());

router.get("/all", getAllGifs)

module.exports = router;