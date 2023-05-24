const express = require("express");
const router = express.Router();
const cors = require('cors');

const { getAllImagesPublicController } = require("../controllers");

const { getAllImages  } = getAllImagesPublicController;

router.use(cors());

router.get("/all", getAllImages)

module.exports = router;