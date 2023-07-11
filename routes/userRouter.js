const router = require("express").Router()
const {getUsers,getUser,addUser,updateUser,deleteUser} = require("../controllers/userController")
const userMiddleware = require("../controllers/middleware/userMiddleware")
const findUser = require("../controllers/middleware/findUser")

router.use("/", findUser)
router.use("/:id", userMiddleware)

router.route("/").get(getUsers).post(addUser)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router