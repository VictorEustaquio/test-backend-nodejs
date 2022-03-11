const bcrypt = require("bcrypt");
const db = require("../../../config/database");

var { requestResponse } = require("../../models/response");

module.exports = {
  async create(req, res) {
    const { username, email, password } = req.body;

    if (password) req.body.passwordHash = await bcrypt.hash(password, 12);
    try {
      return await db.User.create(req.body)
        .then((data) => {
          delete data.password;
          return res
            .status(200)
            .json(requestResponse(data, true, "User created!", false));
        })
        .catch((error) => {
          var response = null;
          if (error.message.includes("duplicate")) {
            error.message = "email is already registered!";
            response = requestResponse(
              null,
              false,
              "Conflict",
              false,
              error.message
            );
            res.status(409);
          } else {
            res.status(400);
            response = requestResponse(
              null,
              false,
              "Bad request",
              false,
              error.message
            );
          }

          return res.json(response);
        });
    } catch (err) {
      return res
        .status(500)
        .json(
          requestResponse(null, false, "Internal Error", true, err.message)
        );
    }
  }, //ok

  async get(req, res) {
    try {
      const u = await db.User.findOne({ _id: req.params.id });
      return res.json(u);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  async find(req, res) {
    try {
      const dados = await db.User.find({});
      return res.json(dados);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  async edit(req, res) {
    if (!req.body.senha) delete req.body.password;
    else req.body.password = bcrypt.hash(req.body.password, 12);

    try {
      let u = await db.User.updateOne(
        { _id: req.body._id },
        { $set: req.body }
      );
      return res.json(u);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  async remove(req, res) {
    try {
      const u = await db.User.deleteOne({ _id: req.params.id });
      return res.json(u);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
};
