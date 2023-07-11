//get product schema
const Product = require("../models/productModel")
//get all products
const getProducts = (req, res) =>
{
    res.status(200).json({success:true, data:res.products,  message:`retrieved product array of length ${res.products.length}`})    
}

//get one product
const getProduct = (req, res) =>
{
    res.status(200).json({success:true, data:[res.current_product], message:`returned product '${res.current_product.name}'`})
}

//add one product
const addProduct = async (req, res) =>
{
    try 
    {
        const current_product = await Product.productModel.create({...req.body})
        res.status(201).json({success:true, data:[current_product], message:`added new product '${current_product.name}' to 'products'`})
    } 
    catch (error) 
    {
        res.status(400).json({success:false, data:[], message:error.message})
    }
}

// update one product
const updateProduct = async (req, res) =>
{
    let updated = Object.keys(req.body).join(", ")
    for (let i in req.body)
    {
        res.current_product[i] = req.body[i]
    }
    try 
    {
        await res.current_product.save()
        res.status(200).json({success:true, data:[res.current_product], message:`Updated '${updated}' in product: '${res.current_product.name}'`})
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
}

// delete one product
const deleteProduct = async (req, res) =>
{
    try 
    {
        await Product.productModel.deleteOne({_id : res.current_product._id})
        res.status(200).json({success:true, data:[], message:`Removed product with id:${res.current_product._id}`})
    } 
    catch (error) 
    {
        res.status(404).json({success:false, data:[], message:error.message})
    }
}

module.exports = {getProducts, getProduct, addProduct, updateProduct, deleteProduct}