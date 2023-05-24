const express = require("express");
const router = express.Router();
const { gifController } = require("../controllers");

const { getManyById, uploadGif, deleteGif,getById, getByName } = gifController;


router
    .get("/id/many/:ids", getManyById)
    .post("/create", uploadGif)
    .patch("/delete/:id", deleteGif)
    .get("/id/:gifId", getById)
    .get("/name/:title", getByName)




module.exports = router;