const User = require("../../models/userModel")
const Cart = require("../../models/cartModel").cartModel

const retrieveUser = async (req, res, next) =>
{
    let currentUser
    const {id} = req.params
    try 
    {
        currentUser = await User.userModel.findById(id)
        if(!currentUser)
        {
            return res.status(400).json({success:false, data:[], message:`No user with id:${id}`})
        }
        currentUser.cart.items = await Cart.findByUserId(id)

    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})    
    }
    res.currentUser = currentUser
    next()
}


module.exports = retrieveUser