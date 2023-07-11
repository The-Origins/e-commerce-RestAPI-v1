require("dotenv").config()
const mongoose = require("mongoose")



const reviewSchema = new mongoose.Schema({
    createdAt:
    {
        type: Date,
        default:() => Date.now(),
        immutable:true
    },
    userName:{
        type:String,
        required:true
    },
    title:
    {
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})

//schema
const productSchema = new mongoose.Schema({
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
    name:{
        type:String,
        required: true,
        lowercase:true
    },
    stock:{
        type:Number,
        required: true,
        default:0
    },
    unitPrice:{
        type:
        {
            currency:
            {
                type:String,
                required:true,
                default: "coin",
                uppercase: true
            },
            amount:
            {
                type:Number,
                required:true
            }
        },
        required: true
    },
    description:{
        type:String,
        required: true,
        default:"Awesome product"
    },
    deliveryFee:
    {
        type:Number,
        required:true,
        default:200
    },
    rating:{
        type:
        {
            score:{
            type:Number,
            max:5,
            default:0
        },
        votes:
        {
            type:Number,
            default:0
        },
        ratigns:[Number]
    },
        default:{}
    },
    reviews:
    {
        type:[reviewSchema],
        default:[]
    },
    brand:
    {
        type:String,
        required:true,
        default:"Generic"
    },
    categories:
    {
        type:[String],
        required:true,
        lowercase:true
    },
    variations:
    {
        type:[String],
        lowercase:true
    },
    image:
    {
        type:[String],
        required:true
    }
})


productSchema.pre("save", function(next) {
    this.updatedAt = Date.now()
    this.categories = [...this.categories, this.categories.map((category) => 
        {return category[category.length] === "s" ? String(category) + "es"  : String(category) + "s"})]
    next()
})

productSchema.statics.findByCategory = function (category) 
{
    return this.find({categories:new RegExp(category,"i")}).sort({"rating.score":-1})
}

productSchema.statics.findByName = function (name)
{
    return this.find({name:new RegExp(name,"i")}).sort({"rating.score":-1})
}

productSchema.statics.findByBrand = function (brand)
{
    return this.find({brand:new RegExp(brand,"i")}).sort({"rating.score":-1})
}

productSchema.statics.findBySearch = async function (search,price,brand)
{
    let results = await this.findByName(search)
    let resultAmount = 6
    //search by name

    const updateByPrice = (price)  =>
    {
        if(price.func === ">")
            {
                results = results.filter((result) =>
                {
                    return result.unitPrice.amount >= price.amount
                })
            }
            else
            {
                results = results.filter((result) =>
                {
                    return result.unitPrice.amount < price.amount
                })
            }
    }

    const updateByBrand = (brand) =>
    {
        results = results.filter((result) =>
            {
                return result.brand === brand
            })
    }

    if(results.length >= resultAmount)
    {
        if(price.amount !== undefined)
        {
            updateByPrice(price)
        }
        if(brand !== undefined)
        {
            updateByBrand(brand)
        }
    }
    //search by category and name
    else
    {
        results =  [...results, ...(await this.findByBrand(search))]
        if(results.length >= resultAmount)
        {
            if(price.amount !== undefined)
            {
                updateByPrice(price)
            }
            if(brand !== undefined)
            {
                updateByBrand(brand)
            }
        }
        else
        {
            results = [...results, ...(await this.findByCategory(search))]
            if(price.amount !== undefined)
            {
                updateByPrice(price)
            }
            if(brand !== undefined)
            {
                updateByBrand(brand)
            }
        }
    }
    return results
}

const productModel = mongoose.model("products", productSchema)

module.exports = {productModel, productSchema}