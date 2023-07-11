const mongoose = require("mongoose")
const Product = require("./productModel")
const User = require("./userModel")

const cartSchema = new mongoose.Schema(
    {
        createdAt:
        {
            type: Date,
            default:() => Date.now(),
            immutable:true
        },
        updatedAt:
        {
            type: Date,
            default:() => Date.now()
        },
        userId:
        {
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            immutable:true
        },
        product:
        {
            type:Product.productSchema,
            required:true,
            immutable:true
        },
        quantity:
        {
            type:Number,
            required: true,
            default: 1
        },
        total:
        {
            type:Number,
            required:true,
            default:1
        }
    }
)

cartSchema.pre("save", function(next) {
    this.updatedAt = Date.now()
    this.total = this.quantity * this.product.unitPrice.amount
    next()
})

cartSchema.statics.findByUserId = function(userId)
{
    return this.find({userId:userId})
}

const cartModel = mongoose.model("cart", cartSchema)

module.exports = {cartModel, cartSchema}