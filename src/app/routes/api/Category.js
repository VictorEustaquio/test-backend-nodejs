const router = require("express").Router();
const categoriesController = require('../../controllers/api/Categories');


router.get("/", categoriesController.findCategories);

router.get("/:id", categoriesController.get);

router.get("/categories/", categoriesController.getCategory)

router.get("/category/:name", categoriesController.getCategory);

router.get("/titulo/:title/category/:category", categoriesController.get);

router.get("/filter/:title:category", categoriesController.findCategories);

router.post("/", categoriesController.edit);

router.put("/", categoriesController.create);

router.patch("/:id", categoriesController.edit);

router.delete("/:id", categoriesController.remove);


module.exports = router;


