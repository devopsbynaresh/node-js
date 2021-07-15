const _ = require('lodash');

const userAccountModel = require('../Models/userAccountModel');

//add user's account controller
const addUserAccount = async( req, res ) =>{
try{
    var addedUser = await userAccountModel.create(req.body);
    res.json({
        status:true,
        message:"inserted successfully!",
        data: addedUser
    });
}catch(error){
    res.json({
        status:false,
        message: error.message
    });
}

}

//update user's account controller
const updateUserAccount = async( req, res ) =>{
    try{
        var query = {};
        if(req.body){
            if(req.body.user_id) query.user_id = req.body.user_id;
            if(req.body.institute_id) query.institute_id = req.body.institute_id;
            if(req.body.account_balance) query.account_balance = req.body.account_balance;
            if(req.body.account_currency) query.account_currency = req.body.account_currency;
            if(req.body.account_nickname) query.account_nickname = req.body.account_nickname;
            if(req.body.account_icon) query.account_icon = req.body.account_icon;
            if(req.body.account_description) query.account_description = req.body.account_description;
        }
        var updatedUser = await userAccountModel.findByIdAndUpdate(req.params.account_id, query, { new:true });
        res.json({
            status:true,
            message:"updated successfully!",
            data: updatedUser
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    }

//delete user's account controller
const deleteUserAccount = async( req, res ) =>{
    try{
        var deletedUser = await userAccountModel.findByIdAndUpdate(req.body.account_id,{delete:true},{ new:true });
        res.json({
            status:true,
            message:`${deletedUser.account_nickname} deleted successfully!`
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    }

//get account-detail for a specific user controller
const getUserAccount = async( req, res ) =>{
    try{
        var getUser = await userAccountModel.find({user_id:req.params.user_id, delete:false});
        if(getUser.length > 0){
            res.json({
                status:true,
                Total_length:getUser.length,
                data: getUser
            });
        }else{
            throw new Error('No account exist for this user!');
        }
      
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    }

module.exports = {
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    getUserAccount
}