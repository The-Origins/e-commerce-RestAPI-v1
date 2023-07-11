const router = require("express").Router()
const {getCarts,getCart,addCart,updateCart,deleteCart} = require("../controllers/cartController")
const cartMiddleware = require("../controllers/middleware/cartMiddleware")

router.use("/:id", cartMiddleware)

router.route("/").get(getCarts)
router.route("/:id").get(getCart).patch(updateCart).delete(deleteCart).post(addCart)

module.exports = router