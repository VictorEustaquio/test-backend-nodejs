const router = require('express').Router();
const produtosController = require('../../controllers/api/Products');
const authorize = require('../../middlewares/authorize');
const Role = require('../../models/role');

router.put("/", produtosController.create) //Create product ok category can be created here to by pass {category : 'CategoryName'}
router.get("/", produtosController.find); //ok
router.get("/:id", produtosController.get); //ok
router.get("/title/:title", produtosController.getByTitle); //ok
router.get("/category/:category", produtosController.getByCategory); //ok
router.get("/title/:title/category/:category", produtosController.get); //ok
router.get("/:title/:category", produtosController.get); //ok
router.patch("/", produtosController.edit) //ok
router.patch("/:id", produtosController.edit) //ok
router.delete("/", produtosController.remove) //ok
router.delete("/:id", produtosController.remove) //ok

router.delete("/delete/all/", authorize(Role.Admin), produtosController.removeAll)

module.exports = router










/* router.get("/:title/", produtosController.get)
router.get("/:title/:category", produtosController.get) */


/* router.get("/title/:title/", produtosController.get)
router.get("/title/:title/category/:category", produtosController.get) */