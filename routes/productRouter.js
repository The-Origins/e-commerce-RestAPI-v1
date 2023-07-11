const router = require("express").Router()
const {getProducts, getProduct, addProduct, updateProduct, deleteProduct} = require("../controllers/productController")
const retrieveProduct = require('../controllers/middleware/prodMiddleware')
const filteredProducts = require("../controllers/middleware/filterProducts")

//middleware
router.use("/:id", retrieveProduct)

router.get("/", filteredProducts, getProducts)
router.post( "/", addProduct)
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router