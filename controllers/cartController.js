const Cart = require("../models/cartModel").cartModel
//get all products
const getCarts = async (req, res) =>
{
    try 
    {
        const carts = await  Cart.find()
        res.status(200).json({success:true, data:carts, message:`retrieved cart array of length ${carts.length}`})    
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
}

//get one product
const getCart = (req, res) =>
{
    res.status(200).json({success:true, data:[res.user.cart], message:`returned cart for user '${res.user.name.first}' item amount: ${res.user.cart.length}`})
}

//add one product
const addCart = async (req, res) =>
{
    try 
    {
        const newCart = await Cart.create({...req.body, "userId":res.user._id})
        res.status(201).json({success:true, data:[newCart], message:`Added cart item '${newCart.product.name}' for user '${res.user.name.first}'`})
    } 
    catch (error) 
    {
        res.status(400).json({success:false, data:[], message:error.message})
    }
}

// update one product
const updateCart= async (req, res) =>
{
    let updated = Object.keys(req.body).join(", ")
    for (let i in req.body)
    {
            res.cartItem[i] = req.body[i]
    }
    try 
    {
        await res.cartItem.save()
        await res.user.save()
        res.status(200).json({success:true, data:[res.cartItem], message:`Updated '${updated}' in ${res.user.name.first}'s cart`})
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
} 

// delete one product
const deleteCart = async (req, res) =>
{
    try 
    {
        await Cart.deleteOne({_id : res.cartItem._id})
        await res.user.save()
        res.status(200).json({success:true, data:[], message:`Removed cart item with id:${res.cartItem._id}`})
    } 
    catch (error) 
    {
        res.status(404).json({success:false, data:[], message:error.message})
    }
}

module.exports = {
    getCarts,
    getCart,
    addCart,
    updateCart,
    deleteCart
}