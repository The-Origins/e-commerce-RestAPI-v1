const Cart = require("../../models/cartModel").cartModel
const User = require("../../models/userModel")

const retrieveCart = async (req, res, next) =>
{
    let cartItem
    let user
    const {id} = req.params
    const {itemId} = req.body
    try 
    {
        user = await User.userModel.findById(id)

        if(!user)
        {
            return res.status(400).json({success:false, data:[], message:`No user with Id:${id}`})
        }
        user.cart.items = await Cart.findByUserId(id)
        user.save()
        if(itemId)
        {
            cartItem = await Cart.findById(itemId)
            if(!cartItem)
            {
                return res.status(400).json({success:false, data:[], message:`No cart item with Id:${itemId}`})
            }
        }
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})    
    }
    res.user = user
    res.cartItem = cartItem
    next()
}

module.exports = retrieveCart