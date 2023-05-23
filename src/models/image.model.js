const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  title: {
    type: String,
    required: [true, "You need to add the title for the image"],
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
  img: {
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
    required:true
  },
  status: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

const ImageModel = model("images", imageSchema);

module.exports = ImageModel;
