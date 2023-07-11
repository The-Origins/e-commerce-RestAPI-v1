const router = require("express").Router()
const {getOrders,getOrder,addOrder,updateOrder,deleteOrder} = require("../controllers/orderController")
const orderMiddleware = require("../controllers/middleware/orderMiddleware")

router.use("/:id", orderMiddleware)

router.route("/").get(getOrders).post(addOrder)
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder)

module.exports = router