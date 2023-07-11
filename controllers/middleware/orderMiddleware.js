const Order = require("../../models/orderModel")
const User = require("../../models/userModel")

const retrieveOrder = async (req, res, next) =>
{
    let order
    let user
    const {id} = req.params
    const {userId} = req.body
    try 
    {
        if(userId)
        {
            if(User.userModel.findById(userId))
            {
                user = await User.findById(userId)
            }
            else
            {
                return res.status(400).json({success:false, data:[], message:`No user with id:${userId}`})
            }
        }
        user.save()
        order = await Order.findById(id)
        if(!order)
        {
            return res.status(400).json({success:false, data:[], message:`No order with id:${id}`})
        }
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})    
    }
    res.currentOrder = order
    res.currentUser = user
    next()
}

module.exports = retrieveOrder