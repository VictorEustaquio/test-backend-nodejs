const router = require('express').Router();
const User = require('../../controllers/api/Users');


router.get("/", async(req, res)=>{
  console.log("render page Signup")
  return res.render('Signup')
})

router.post("/", User.create); //ok
router.put("/", User.create);  //ok

module.exports = router;


