const router = require('express').Router();
const authorize = require('../../middlewares/authorize');
const Role = require('../../models/role');

router.use("/signup", require("./Signup"));
router.use("/product", authorize(Role.User), require("./Product"));
router.use("/category", authorize(), require("./Category"));



module.exports = router


