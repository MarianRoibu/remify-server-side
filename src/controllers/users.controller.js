const { UserModel, albumModel } = require("../models");
const { uploadUserImage } = require("../utils/cloudinary");
const fs = require("fs-extra");

const userController = {
    postUser: async (req, res, next) => {
        const { auth: { payload: { sub } } } = req;
        const { name, email, img, role, username } = req.body

  

        try {
            const searchIfCreated = await UserModel
                .findOne({
                    "$or": [
                        {
                            email: email
                        },
                        {
                            sub: sub
                        },
                        {
                            username: username
                        }
                    ]
                })
                .lean()
                .exec();

            if (searchIfCreated) {
                return res.status(412).send({
                    status: false,
                    msg: "User already registered."
                })
            }

            const user = await UserModel
                .create(
                    {
                        name,
                        email,
                        img: {
                            secure_url: img
                        },
                        sub,
                        role,
                        username,
                    }
                );

            if (!user) {
                res.status(404).send({
                    status: false,
                    msg: "We coundn't create your user",
                })
                return;
            }

            res.locals.userId = user._id;

            next();
        } catch (error) {
            res.status(500).send({
                path: "user controller",
                status: false,
                msg: error.message
            })
        }
    },
    getBySub: async (req, res) => {
        const { sub } = req.auth.payload;
      
        try {
          const user = await UserModel.findOne({ sub: sub }).lean().exec();
      
          if (!user) {
            res.status(404).send({
              status: false,
              msg: "We couldn't find your user",
            });
            return;
          }
      
          res.status(200).send({
            status: true,
            data: user,
          });
        } catch (error) {
          res.status(500).send({
            status: false,
            msg: error,
          });
        }
      },

    getById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                res.status(404).send({
                    status: false,
                    msg: "We coundn't find your user",
                })
                return
            }

            res.status(200).send({
                status: true,
                data: user
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error
            })
        }
    },
    getRandomUsers: async (req, res) => {
        const { count } = req.query;
        const { userId } = req.params;
      
        try {
            const user = await UserModel.find().limit(parseInt(count)).lean();
      
          res.status(200).send({
            status: true,
            data: user,
          });
        } catch (error) {
          res.status(500).send({
            status: false,
            msg: error.message,
          });
        }
      },
    updateBasic: async (req, res) => {
        const { body } = req;
        const { userId } = req.params;

        try {
            const updateUser = await UserModel.findByIdAndUpdate(
                { _id: userId },
                { name: body.name },
                { new: true }
            );

            if (!updateUser) {
                res.status(404).send({
                    status: false,
                    msg: "User not found",
                });
                return;
            }

            res.status(200).send({
                status: true,
                msg: "User updated successfully",
                data: updateUser,
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error.message,
            });
        }
    },
    
    deleteUser: async (req, res) => {
        const { body } = req;
        const { userId } = req.params;
        try {
            const updateUser = await UserModel.findByIdAndUpdate(
                { _id: userId },
                { ...body },
                { new: true }
            );
            res.status(200).send({
                status: true,
                msg: "User deleted successfully",
                data: updateUser
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error
            })
        }
    },
    getByName: async (req, res) => {
        const { userName } = req.params;
        try {
            const user = await UserModel
                .find({
                    "name": {
                        "$regex": userName,
                        "$options": "i"
                    }
                })
                .lean()
                .exec();

            if (user.length <= 0) {
                res.status(404).send({
                    status: false,
                    msg: "We coundn't find your user",
                })
                return
            }

            res.status(200).send({
                status: true,
                data: user
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error
            })
        }
    }

}

module.exports = { userController };