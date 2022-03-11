const env = require("../../../config/dotenv");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../../models/mongoose/User");

const userService = require("../../service/User");

var { requestResponse } = require("../../models/response");

router.get("/", async (req, res) => {
  try {
    return res.render("login");
  } catch (error) {
    console.trace(error.message);
    return res
      .status(500)
      .json(
        requestResponse(null, false, "Internal Error", true, error.message)
      );
  }
});

module.exports = router;
