const connectDB = require("./utils/connectDB.js");
const express = require("express");
const cors = require("cors");
const jwtCheck = require("./utils/authz.js")
const { 
    imageRouter,
    gifRouter,
    userRouter
} = require("./routes")
const {
    PORT,
    DB
} = require("./config/config.js");
const fileUpload = require("express-fileupload")


const app = express();


app.use(cors());
app.use(express.json());
app.use(jwtCheck);
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './src/assets/tmp/'
}));

// Conect DB
connectDB(app, PORT, DB);

// Routes
app.use("/gif", gifRouter)
app.use("/image", imageRouter)
app.use("/users", userRouter)