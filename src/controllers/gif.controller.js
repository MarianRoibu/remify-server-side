const { gifModel } = require("../models");
const fs = require("fs-extra");
const { uploadGif } = require("../utils/cloudinary");

const gifController = {
  getAllGifs: async (req, res) => {
    try {
      const gifs = await gifModel.find({ status: 1 }).sort({ _id: -1 }).limit(48);

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
    const { file } = req;

    if (!file) {
      return res.status(400).send({
        status: false,
        msg: "You need to upload a GIF",
      });
    }

    try {
      const { public_id, secure_url } = await uploadGif(file.tempFilePath);
      await fs.unlink(file.tempFilePath);

      const newGif = await gifModel.create({
        public_id,
        secure_url,
      });

      res.status(201).send({
        status: true,
        msg: "GIF uploaded successfully",
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
      const deletedGif = await gifModel.findOneAndUpdate(
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
