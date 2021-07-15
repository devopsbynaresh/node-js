const _ = require('lodash');

const userCounterPartyModel = require('../Models/userCounterPartyModel');

//add user's counterparty controller
const addCounterparty = async( req, res ) =>{
try{
    var addedUser = await userCounterPartyModel.create(req.body);
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

//update user's counterparty controller
const updateUserCounterparty = async( req, res ) =>{
    try{
        var query = {};
        if(req.body){
            if(req.body.user_id) query.user_id = req.body.user_id;
            if(req.body.central) query.central = req.body.central;
            if(req.body.counterparty_name) query.counterparty_name = req.body.counterparty_name;
            if(req.body.counterparty_type) query.counterparty_type = req.body.counterparty_type;
            if(req.body.counterparty_description) query.counterparty_description = req.body.counterparty_description;
            if(req.body.counterparty_icon) query.counterparty_icon = req.body.counterparty_icon;
        }
        var updatedUser = await userCounterPartyModel.findByIdAndUpdate(req.params.counterparty_id, query, { new:true });
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

//delete user's counterparty controller
const deleteUserCounterparty = async( req, res ) =>{
    try{
        var deletedUser = await userCounterPartyModel.findByIdAndUpdate(req.body.counterparty_id,{delete:true},{ new:true });
        res.json({
            status:true,
            message:`${deletedUser.counterparty_name} deleted successfully!`
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    }

//get all counterparty for a specific user controller
const getUserCounterparty = async( req, res ) =>{
    try{
        var getUser = await userCounterPartyModel.find({user_id:req.params.user_id, delete:false});
        if(getUser.length > 0){
            res.json({
                status:true,
                Total_length:getUser.length,
                data: getUser
            });
        }else{
            throw new Error('No counterparty exist for this user!');
        }
      
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    }

   //get list of central  counterparty  controller
const getCentralCounterpartyList = async( req, res ) =>{
    try{
        var centralCounterpartyList = await userCounterPartyModel.find({central:true, delete:false});
        if(centralCounterpartyList.length > 0){
            res.json({
                status:true,
                Total_length:centralCounterpartyList.length,
                data: centralCounterpartyList
            });
        }else{
            throw new Error('No central counterparty exists yet!');
        }
      
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
    } 

module.exports = {
    addCounterparty,
    updateUserCounterparty,
    deleteUserCounterparty,
    getUserCounterparty,
    getCentralCounterpartyList
}