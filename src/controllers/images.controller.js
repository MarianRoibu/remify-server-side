const { ImageModel } = require("../models");
const { UserModel } = require("../models")
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
  getImagesByOwner: async (req, res) => {
    const { params: { ownerId } } = req;

        try {
            const image = await ImageModel
                .find({ owner: ownerId })
                .sort({ _id: -1 })
                .lean()
                .exec();

            res.status(200).send({
                status: true,
                msg: "We found image.",
                data: image
            });
        } catch (err) {
            res.status(503).send({
                status: false,
                msg: err
            })
        }
  },

  uploadImage: async (req, res) => {
    const { body, files } = req;
  
    if (!files.img || !(files.img.name.toLowerCase().endsWith('.jpg') || files.img.name.toLowerCase().endsWith('.jpeg') || files.img.name.toLowerCase().endsWith('.png'))) {
      res.status(409).send({
        status: false,
        msg: "Invalid file format. Only .jpg, .jpeg, and .png files are allowed.",
      });
      return;
    }
  
    // Retrieve the owner's user ID from the form data
    const ownerId = req.body.owner;
  
    try {
      const { public_id, secure_url } = await uploadImage(files.img.tempFilePath);
      await fs.unlink(files.img.tempFilePath);
  
      const newImage = await ImageModel.create({
        ...body,
        owner: ownerId, // Set the owner as the user ID
        img: { public_id, secure_url },
      });
  
      const user = await UserModel
        .findOneAndUpdate(
          {
            _id: newImage.owner
          },
          {
            "$addToSet": { images: newImage._id }
          },
          {
            new: true
          }
        )
        .populate("images")
  
      res.status(201).send({
        status: true,
        msg: "We created a new image",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: error,
      });
    }
  },
  

  getManyById: async (req, res) => {
    const { params: { ids } } = req;

    const arrayId = ids.split(",");

    try {
        const image = await ImageModel
            .find({
                _id: {
                    $in: arrayId
                },
                status: 1
            })
            .sort({
                _id: -1
            })
            .lean()
            .exec();

        if (image.length < 1) {
            res.status(404).send({
                status: false,
                msg: "We couldn't find images"
            });
            return;
        }

        res.status(200).send({
            status: true,
            msg: "We find images",
            data: image
        })
    } catch (err) {
        res.status(503).send({
            status: false,
            msg: err.message
        })
    }
},
getById: async (req, res) => {
  const { imageId } = req.params;
  try {
      const image = await ImageModel.findById(imageId);

      if (!image) {
          res.status(404).send({
              status: false,
              msg: "We coundn't find your image",
          })
          return
      }

      res.status(200).send({
          status: true,
          data: image
      })
  } catch (error) {
      res.status(500).send({
          status: false,
          msg: error
      })
  }
},
getByName: async (req, res) => {
  const { title } = req.params;
  try {
      const image = await ImageModel
          .find({
              "title": {
                  "$regex": title,
              }
          })
          .lean()
          .exec();

      if (image.length <= 0) {
          res.status(404).send({
              status: false,
              msg: "We coundn't find your image",
          })
          return
      }

      res.status(200).send({
          status: true,
          data: image
      })
  } catch (error) {
      res.status(500).send({
          status: false,
          msg: error
      })
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
