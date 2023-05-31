const { GifModel } = require("../models");
const { UserModel } = require("../models");
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

  getById: async (req, res) => {
    const { gifId } = req.params;
    try {
        const gif= await GifModel.findById(gifId);
  
        if (!gif) {
            res.status(404).send({
                status: false,
                msg: "We coundn't find your gif",
            })
            return
        }
  
        res.status(200).send({
            status: true,
            data: gif
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            msg: error
        })
    }
  },
 

  uploadGif: async (req, res, file) => {
    const { body, files } = req;
    if (!files.gif || !files.gif.name.endsWith('.gif')) {
      res.status(409).send({
        status: false,
        msg: "Invalid file format. Only .gif files are allowed.",
      });
      return;
    }
  
    // Retrieve the owner's user ID from the form data
    const ownerId = req.body.owner;
  
    try {
      const { public_id, secure_url } = await uploadGif(files.gif.tempFilePath);
      await fs.unlink(files.gif.tempFilePath);
  
      const newGif = await GifModel.create({
        ...body,
        owner: ownerId, // Set the owner as the user ID
        gif: { public_id, secure_url },
      });
      const user = await UserModel
        .findOneAndUpdate(
          {
            _id: newGif.owner
          },
          {
            "$addToSet": { gifs: newGif._id }
          },
          {
            new: true
          }
        )
        .populate("gifs")
      res.status(201).send({
        status: true,
        msg: "We created a new gif",
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
        const gif = await GifModel
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

        if (gif.length < 1) {
            res.status(404).send({
                status: false,
                msg: "We couldn't find gifs"
            });
            return;
        }

        res.status(200).send({
            status: true,
            msg: "We find gifs",
            data: gif
        })
    } catch (err) {
        res.status(503).send({
            status: false,
            msg: err.message
        })
    }
},

  getByName: async (req, res) => {
  const { title } = req.params;
  try {
      const gif = await GifModel
          .find({
              "title": {
                  "$regex": title,
              }
          })
          .lean()
          .exec();

      if (gif.length <= 0) {
          res.status(404).send({
              status: false,
              msg: "We coundn't find your gif",
          })
          return
      }

      res.status(200).send({
          status: true,
          data: gif
      })
  } catch (error) {
      res.status(500).send({
          status: false,
          msg: error
      })
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
