const { Schema, model } = require("mongoose");

const gifSchema = new Schema({
  title: {
    type: String,
    required: [true, "You need to add the title for the GIF"],
    minlength: [2, "Title must be at least 2 characters long"],
    maxlength: [40, "Title cannot be more than 40 characters long"]
  },
  artist: {
    type: String,
    required: false
  },
  release: {
    type: Date,
  },
  gif: {
    public_id: {type: String, required: true},
    secure_url: {type: String, required: true}
  },
  statistics: {
    type: Schema.Types.ObjectId,
    ref: "statistics"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

const GifModel = model("gifs", gifSchema);

module.exports = GifModel;
