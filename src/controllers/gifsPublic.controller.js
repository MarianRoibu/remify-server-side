const { GifModel } = require("../models");
const fs = require("fs-extra");


const getAllGifPublicController = {
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
      
  }
  
module.exports = { getAllGifPublicController };
