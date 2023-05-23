const { GifModel } = require("../models");
const fs = require("fs-extra");
const { uploadGif } = require("../utils/cloudinary");

const gifController = {
  getAllGifs: async (req, res) => {
    try {
      const gifs = await GifModel.find({ status: 1 }).sort({ _id: -1 }).limit(48);

      if (!gifs) {
        return res.status(404).send({
          status: false,
          msg: "We couldn't find GIFs",
        });
      }

      res.status(200).send(gifs);
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },

  uploadGif: async (req, res) => {
    const { body, files } = req;

      // Retrieve the owner's user ID from the form data
    const ownerId = req.body.owner;

    if (!files.gif) {
      res.status(409).send({
        status: false,
        msg: "You need to add an image",
      });
      return;
    }
  
    try {
      const { public_id, secure_url } = await uploadGif(files.gif.tempFilePath);
      await fs.unlink(files.gif.tempFilePath);
  
      const newGif = await GifModel.create({
        ...body,
        owner: ownerId, // Set the owner as the user ID
        gif: { public_id, secure_url },
      });
  
      res.status(201).send({
        status: true,
        msg: "We created a new gif",
        data: newGif,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },

  deleteGif: async (req, res) => {
    const { id: gifId } = req.params;

    try {
      const deletedGif = await GifModel.findOneAndUpdate(
        {
          _id: gifId,
          status: 1,
        },
        {
          status: 0,
        }
      );

      if (!deletedGif) {
        return res.status(404).send({
          status: false,
          msg: "GIF not found",
        });
      }

      res.status(200).send({
        status: true,
        msg: "GIF deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },
};

module.exports = { gifController };
