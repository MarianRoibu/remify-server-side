const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
// const { verifyRequester } = require("../middlewares/verifyRequester");

const { postUser, getBySub, getRandomUsers, getById, updateBasic, deleteUser, getByName, getByUsername } = userController;

router
    .get("/sub", getBySub)
    .get("/random", getRandomUsers) 
    .get("/id/:userId", getById)
    .get("/name/:userName", getByName)
    .get("/username/:username", getByUsername)
    .patch("/update/:userId", updateBasic)
    .patch("/delete/:userId", deleteUser)
    .post("/create", postUser);

module.exports = router;