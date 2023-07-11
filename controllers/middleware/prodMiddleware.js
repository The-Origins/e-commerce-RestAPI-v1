const Product = require("../../models/productModel").productModel

const retrieveProduct = async (req, res, next) =>
{
    let current_product
    const {id} = req.params
    try 
    {
        current_product = await Product.findById(id)
        if(!current_product)
        {
            return res.status(400).json({success:false, data:[], message:`No product with id:${id}`})
        }
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})    
    }
    res.current_product = current_product
    next()
}

module.exports = retrieveProduct