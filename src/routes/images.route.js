const express = require("express");
const router = express.Router();
const { imageController } = require("../controllers");

const { uploadImage, deleteImage, getImagesByOwner, getManyById, getById, getByName } = imageController;


router
    .get("/owner/:owner", getImagesByOwner)
    .post("/create",  uploadImage)
    .patch("/delete/:id", deleteImage)
    .get("/id/many/:ids", getManyById)
    .get("/id/:imageId", getById)
    .get("/name/:title", getByName)



module.exports = router;