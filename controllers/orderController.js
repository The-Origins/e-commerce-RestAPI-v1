const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
//get all products
const getOrders = async (req, res) =>
{
    try 
    {
        const orders = await  Order.find()
        res.status(200).json({success:true, data:orders, message:`retrieved order array of length ${orders.length}`})    
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
}

//get one product
const getOrder = (req, res) =>
{
    res.status(200).json({success:true, data:[res.currentOrder], message:`returned order for user '${res.currentOrder.user.name.first}' order total: ${res.currentOrder.order.total}`})
}

//add one product
const addOrder = async (req, res) =>
{
    try 
    {
        const newOrder = await Order.create({...req.body})
        await Cart.cartModel.deleteMany({"userId":req.body.user._id})
        res.status(201).json({success:true, data:[newOrder], message:`Added order:${newOrder._id} to orders and deleted ${req.body.user.name.first}'s cart`})
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
}

// update one product
const updateOrder= async (req, res) =>
{
    let updated = Object.keys(req.body).join(", ")
    for (let i in req.body)
    {
            res.currentOrder[i] = req.body[i]
    }
    try 
    {
        await res.currentOrder.save()
        res.status(200).json({success:true, data:[res.currentOrder], message:`Updated '${updated}' in ${res.currentOrder.user.name.first}`})
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
} 

// delete one product
const deleteOrder = async (req, res) =>
{
    try 
    {
        await Order.deleteOne({_id : res.cartItem._id})
        res.status(200).json({success:true, data:[], message:`Removed cart item with id:${res.cartItem._id}`})
    } 
    catch (error) 
    {
        res.status(404).json({success:false, data:[], message:error.message})
    }
}

module.exports = {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder
}