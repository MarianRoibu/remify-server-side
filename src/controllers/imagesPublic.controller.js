const { ImageModel } = require("../models");
const fs = require("fs-extra");


const getAllImagesPublicController = {
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
  }
  
module.exports = { getAllImagesPublicController };
