const gifRouter = require("./gifs.route")
const imageRouter = require("./images.route")
const userRouter = require("./users.route")
const imagePublicRouter = require("./imagesPublic.route")
const gifPublicRouter = require("./gifsPublic.route")


module.exports = {
    gifRouter,
    gifPublicRouter,
    imageRouter,
    imagePublicRouter,
    userRouter
}