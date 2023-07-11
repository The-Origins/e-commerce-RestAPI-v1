//imports
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 5000
const productRouter = require("./routes/productRouter")
const userRouter = require("./routes/userRouter")
const cartRouter = require("./routes/cartRouter")
const orderRouter = require("./routes/orderRouter")

//database
require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (err) => console.error(err))
db.once("open", () => console.log("database started"))


//middleware
app.use(cors({
    origin:"http://localhost:8000"
}))
app.use(express.json())
app.use("/products",productRouter)
app.use("/users", userRouter)
app.use("/cart", cartRouter)
app.use("/orders", orderRouter)


//initiation
app.get("*",  (req, res) =>
{
    res.status(404).json({success:false, data:[], message:`Couldn't resolve ${req.url}`})
})
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))