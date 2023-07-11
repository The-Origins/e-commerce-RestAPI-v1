const User = require("../../models/userModel")

const findUser = async (req, res, next) =>
{
    let user
    const {email, pass} = req.query
    try 
    {
        if(email && pass)
        {
            user = await User.userModel.findByAuth(email, pass)
            if(!user.length)
            {
             return res.status(200).json({success:false, data:[], message:`No user with credentials: ${email} and ${pass}`})
            }
        }
        if(email && !pass)
        {
            user = await User.userModel.findByEmail(email)
            if(!user.length)
            {
             return res.status(200).json({success:false, data:[], message:`No user with credentials: ${email} and ${pass}`})
            }
        }
    } 
    catch (error) 
    {
        return res.status(500).json({success:false, data:[], message:error.message})
    }

    res.user = user
    next()
}

module.exports = findUser