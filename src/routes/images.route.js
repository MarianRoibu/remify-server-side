const express = require("express");
const router = express.Router();
const { imageController } = require("../controllers");

const { getAllImages,  uploadImage, deleteImage } = imageController;


router
    .get("/all", getAllImages)
    .post("/create",  uploadImage)
    .patch("/delete/:id", deleteImage)


module.exports = router;