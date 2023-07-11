const Product = require("../../models/productModel").productModel

const filteredProducts = async (req, res, next) =>
{
    const search = String(req.query.search).replace("+", " ")
    const {amount,func, brand}  = req.query
    const price = {amount, func}
    let products
    try 
    {
        if(search)
        {
            products = await Product.findBySearch(search, price, brand)
            if(!products)
            {
                return res.status(200).json({success:false, data:[], message:`No products for search '${req.query.search}'`})
            }

            if(req.query.limit)
            {
                products = products.slice(0, Number(req.query.limit))
            }

        }
        else
        {
            return res.status(400).json({success:false, data:[], message:"No category"})
        }
    } 
    catch (error) 
    {
        return res.status(500).json({success:false, data:[], message:error.message})
    }

    res.products = products
    next()
}


module.exports = filteredProducts