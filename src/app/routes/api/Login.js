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

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    userService
      .authenticate({ email, password })
      .then(({ refreshToken, ...user }) => {
        setTokenCookie(res, refreshToken);
        return res
          .status(200)
          .json(requestResponse(user, true, "Success!", false));
      })
      .catch((error) => {
        console.trace(error);
        return res
          .status(401)
          .json(requestResponse(null, false, "Not Authorized", false, error));
      });
  } catch (error) {
    return res
      .status(500)
      .json(
        requestResponse(null, false, "Internal Error", true, error.message)
      );
  }
});

router.post("/token", async (req, res) => {
  let { login, password } = req.body;
  try {
    let user = await userModel.findOne({ login });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Usuário ou login inválido" });
    }

    delete user.password;

    jwt.sign(
      { user },
      env.secret,
      { expiresIn: env.expiresIn },
      (err, token) => {
        return res
          .status(200)
          .cookie("token", token)
          .json({ user, token: "bearer " + token });
      }
    );
  } catch (error) {
    console.trace(error.message);
    res.status(500).json({ details: error.message });
  }
});

/* helper functions */

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}

module.exports = router;
