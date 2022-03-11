const router = require('express').Router();
const authorize = require('../../middlewares/authorize')
const login = require("./login");


router.get('/', require("./login"));  //Render page

router.use("/signup", require("../api/Signup"));
router.use("/login", require("../api/Login"));
router.use("/products", authorize(), require('../api/Product'));



/* 
*Simplified import example
*router.all("/login", require("./web/login"););
*/

/*Destructuring assignment import example
*const requires = (...modules) => modules.map(module => require(module)); 
*const [login, noticias] = requires('./api/login', './web/noticias'); 
*/

module.exports = router


