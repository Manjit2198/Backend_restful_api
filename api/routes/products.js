const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controller/product')
const upload = multer({dest: "uploads"})


router.get('/', ProductsController.product_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.product_create_product);

router.get('/:productId', ProductsController.product_get_product);

router.patch('/:productId', checkAuth, ProductsController.product_update_product);

router.delete('/:productId', checkAuth, ProductsController.product_delete);



module.exports = router;