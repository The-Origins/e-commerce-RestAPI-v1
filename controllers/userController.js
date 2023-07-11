const User = require("../models/userModel").userModel
//get all products
const getUsers = (req, res) =>
{
    res.status(200).json({success:true, data:res.user, message:`returned user`})    
}

//get one product
const getUser = (req, res) =>
{
    res.status(200).json({success:true, data:[res.currentUser], message:`returned user: ${res.currentUser.name.first}`})
}

//add one product
const addUser = async (req, res) =>
{
    try 
    {
        if((await User.find({"email":req.body.email})).length || (await User.find({"phone.code":req.body.phone.code,"phone.number":req.body.phone.number})).length)
        {
            res.status(200).json({success:false, data:[], message:`user with those credentials already exists do you want to login?`})
        }
        else
        {
            const currentUser = await User.create({...req.body})
            res.status(201).json({success:true, data:[currentUser], message:`added new user '${currentUser.name.first + " " +  currentUser.name.last}' to Users`})   
        }
    } 
    catch (error) 
    {
        res.status(400).json({success:false, data:[], message:error.message})
    }
}

// update one product
const updateUser= async (req, res) =>
{
    let updated = Object.keys(req.body).join(", ")
    for (let i in req.body)
    {
        if(i !== "address")
        {
            res.currentUser[i] = req.body[i]
        }
        else
        {
            res.currentUser.address = [...res.currentUser.address, req.body[i]]
        }
    }

    try 
    {
        await res.currentUser.save()
        res.status(200).json({success:true, data:[res.currentUser], message:`Updated '${updated}' in user: '${res.currentUser.name.first}'`})
    } 
    catch (error) 
    {
        res.status(500).json({success:false, data:[], message:error.message})
    }
} 

// delete one product
const deleteUser = async (req, res) =>
{
    try 
    {
        await User.deleteOne({_id : res.currentUser._id})
        res.status(200).json({success:true, data:[], message:`Removed user with id:${res.currentUser._id}`})
    } 
    catch (error) 
    {
        res.status(404).json({success:false, data:[], message:error.message})
    }
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
}