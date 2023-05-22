const express = require("express");
const router = express.Router();
const { gifController } = require("../controllers");

const { getAllGifs, uploadGif, deleteGif } = gifController;


router
    .get("/all", getAllGifs)
    .post("/create", uploadGif)
    .patch("/delete/:id", deleteGif)


module.exports = router;