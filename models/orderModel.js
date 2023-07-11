require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./userModel")

const orderUserSchema = new mongoose.Schema(
    {
        name:
        {
            type:{first:String, last:String},
            required: true
        },
        address: 
        {
            type:User.locationSchema,
            default:[{}]
        },
        email:
        {
            type:String,
            required:true
        },
        phone:
        {
            type:
            {
                code:
                {
                    type:String,
                    default:"+1"
                },
                number:
                {
                    type:Number,
                    required:true
                },
            }
        },
        cart:
        {
            type:
            {
                items:
                {
                    type:[],
                    required:true,
                    default:[]
                },
                cartTotal:
                {
                    type:Number,
                    required:true,
                    default:0
                }
            },
            required:true,
            default:{}
        }
    }
)

const orderSchema = new mongoose.Schema(
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
        user: 
        {
            type:orderUserSchema,
            required:true,
            immutable:true
        },
        order:
        {
            type:{
                items:
                {
                    type:[],
                    required:true,
                    default: []
                },
                total:
                {
                    type:Number,
                    required:true,
                    default: 0
                }
            },
            immutable:true,
            default:{}
        },
        deliveryLocation:
        {
            type:User.locationSchema,
            required:true,
            default: {}
        },
        state:
        {
            type:String,
            default:"unfulfilled"
        }
    }
)

orderSchema.pre("save", function(next) {
    this.order.items = this.order.items.length ? this.order.items: this.user.cart.items
    this.order.total = this.order.total ? this.order.total : this.user.cart.cartTotal
    this.deliveryLocation = this.deliveryLocation ? this.deliveryLocation : this.user.address[0]
    this.user.cart.items = []
    this.user.cart.cartTotal = 0
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model("orders", orderSchema)