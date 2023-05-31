const { Schema, model, Types } = require("mongoose")

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is requeried']
    },
    email: {
        type: String,
        required: [true, 'The email is requeried'],
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20
    },
    img: {
        public_id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            required: true
        }
    },
    sub: {
        required: [true],
        type: String,
        unique: true
    },
    images: [{
        type: Types.ObjectId,
        ref: "images"
    }],
    gifs: [{
        type: Types.ObjectId,
        ref: "gifs"
    }],
    role: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    }
})

const UserModel = model("User", UserSchema)

module.exports = UserModel