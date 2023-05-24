const {gifController} = require("./gif.controller")
const {imageController} = require("./images.controller")
const {userController} = require("./users.controller")
const {getAllImagesPublicController} = require("./imagesPublic.controller")
const {getAllGifPublicController} = require("./gifsPublic.controller")

module.exports = {
    gifController,
    getAllGifPublicController,
    imageController,
    getAllImagesPublicController,
    userController

}