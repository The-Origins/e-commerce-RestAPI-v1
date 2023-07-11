require("dotenv").config()
const path = require("path")
const mongoose = require("mongoose")
const Cart = require("./cartModel")

const locationSchema = new mongoose.Schema(
    {
        country:
        {
            type:String,
            required: true,
            default:"Country 1"
        },
        city:
        {
            type:String,
            required: true,
            default:"city 1"
        }, 
        street:
        {
            type:String,
            required: true,
            default:"street1"
        },
        address:
        {
            type:String,
            required: true,
            default:"address 1"
        }
    }
)

const userSchema = new mongoose.Schema(
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
        name:
        {
            type:{first:String, last:String},
            required: true
        },
        email:
        {
            type:String,
            required: true,
            validate:{
                validator: email => email.includes("@") && email.includes("."),
                message: props => `Invalid email format ${props.value}`
            },
            lowercase:true
        },
        phone:
        {
            type:{
                code:
                {
                    type:String,
                    default:"+1"
                },
                number:
                {
                    type:Number,
                    minLength:9
                }
            },
            required:true
        },
        password:
        {
            type:String,
            required:true,
            minLength:[8, "password too short"]
        },
        pfp:
        {
            type:String,
            default:"https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png"
        },
        address: 
        {
            type:[locationSchema],
            default:[{}]
        },
        cart:
        {
            type:
            {
                items:
                {
                    type:[],
                    required:true
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
        },
        wishlist:
        {
            type:[]
        }
    }
)


userSchema.pre("save", async function(next) {
    let total = 0
    this.cart.items =  await Cart.cartModel.findByUserId(this._id)
    for(let item in this.cart.items)
    {
        total = (total + this.cart.items[item].total)
    }
    this.cart.cartTotal = total
    this.updatedAt = Date.now()
    next()
})

userSchema.statics.findByEmail = function (email)
{
    return this.find({"email":email}, {email:1})
}

userSchema.statics.findByAuth = function (email, pass)
{
    return this.find({"email":email, "password":pass})
}

userSchema.virtual("fullName").get(() =>
{
    return `${this.name.first} ${this.name.last}`
})

userSchema.virtual("fullPhone").get(() =>
{
    return `(${this.phone.code})-${this.phone.number}`
})


const userModel = mongoose.model("users", userSchema)

module.exports = {userModel, userSchema, locationSchema}