const { ImageModel } = require("../models");
const fs = require("fs-extra");
const { uploadImage } = require("../utils/cloudinary");

const imageController = {
  getAllImages: async (req, res) => {
    try {
      const images = await ImageModel.find({ status: 1 }).sort({ _id: -1 }).limit(48);

      if (!images) {
        return res.status(404).send({
          status: false,
          msg: "We couldn't find images",
        });
      }

      res.status(200).send(images);
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },

  uploadImage: async (req, res) => {
    const { body, files } = req;
  
    // Retrieve the owner's user ID from the form data
    const ownerId = req.body.owner;
  
    if (!files.img) {
      res.status(409).send({
        status: false,
        msg: "You need to add an image",
      });
      return;
    }
  
    try {
      const { public_id, secure_url } = await uploadImage(files.img.tempFilePath);
      await fs.unlink(files.img.tempFilePath);
  
      const newImage = await ImageModel.create({
        ...body,
        owner: ownerId, // Set the owner as the user ID
        img: { public_id, secure_url },
      });
  
      res.status(201).send({
        status: true,
        msg: "We created a new image",
        data: newImage,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },

  deleteImage: async (req, res) => {
    const { id: imageId } = req.params;

    try {
      const deletedImage = await ImageModel.findOneAndUpdate(
        {
          _id: imageId,
          status: 1,
        },
        {
          status: 0,
        }
      );

      if (!deletedImage) {
        return res.status(404).send({
          status: false,
          msg: "Image not found",
        });
      }

      res.status(200).send({
        status: true,
        msg: "Image deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },
};

module.exports = { imageController };
