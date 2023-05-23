const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
// const { verifyRequester } = require("../middlewares/verifyRequester");

const { postUser, getBySub, getRandomUsers, getById, updateArray, updateBasic, deleteUser, getByName, getByUsername, updateFollows, updateUserImage, updateFollowsTypes, updateUnfollowsTypes, updateUnFollows } = userController;

router
    .get("/sub", getBySub)
    .get("/random", getRandomUsers) 
    .get("/id/:userId", getById)
    .get("/name/:userName", getByName)
    .get("/username/:username", getByUsername)
    .patch("/update/array/:userId", updateArray)
    .patch("/update/:userId", updateBasic)
    .patch("/updatefollows", updateFollows)
    .patch("/updateunfollows", updateUnFollows)
    .patch("/update/image/:userId", updateUserImage)
    .patch("/delete/:userId", deleteUser)
    .post("/create", postUser);

module.exports = router;