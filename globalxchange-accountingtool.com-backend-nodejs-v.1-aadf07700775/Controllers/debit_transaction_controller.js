const _ = require('lodash');
const axios = require("axios");

const debitTransactionModel = require('../Models/debit_transaction_schema');
const userAccountModel = require('../Models/userAccountModel');

//doing a debit function
const doDebitTransaction = async( req, res ) =>{
    try{
        var debit = {...req.body};
        var userAccount = await userAccountModel.findOne({_id:req.body.account_id, delete: false});
        if( req.body.debit_initiation_currency === userAccount.account_currency){
            userAccount.account_balance = Number(userAccount.account_balance - req.body.ammount_in);
            debit.updated_balance = userAccount.account_balance;
            debit.ledger_changes = Number(( -1 * debit.ammount_in ));
        }
        else{
            var response = await axios.get(
                "https://comms.globalxchange.com/forex/convert",
                {
                  params: {
                    buy: userAccount.account_currency,
                    from: req.body.debit_initiation_currency,
                  },
                }
              );
              var cur_array = Object.values(response.data);
              var convertedAmmount = Number(req.body.ammount_in) * cur_array[2];
              userAccount.account_balance = Number(userAccount.account_balance - convertedAmmount);
              debit.updated_balance = userAccount.account_balance;
              debit.ledger_changes = Number(( -1 * convertedAmmount ));
        }
        var addedDebitTransaction = await debitTransactionModel.create(debit);
        var updateAccount = await axios.post(`https://accountingtool.apimachine.com/update-user-account/${req.body.account_id}`, userAccount);
        res.json({
            status:true,
            message:"ammount debited successfully!",
            data: addedDebitTransaction
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }

}

//update user's counterparty controller
// const updateDebitTransaction = async( req, res ) =>{
//     try{
//         var query = {};
//         if(req.body){
//             if(req.body.user_id) query.user_id = req.body.user_id;
//             if(req.body.account_id) query.account_id = req.body.account_id;
//             if(req.body.counterparty_id) query.counterparty_id = req.body.counterparty_id;
//             if(req.body.debit_initiation_currency) query.debit_initiation_currency = req.body.debit_initiation_currency;
//             if(req.body.ammount_in) query.ammount_in = req.body.ammount_in;
//             if(req.body.nickname) query.nickname = req.body.nickname;
//             if(req.body.description) query.description = req.body.description;
//             if(req.body.icon) query.icon = req.body.icon;
//         }
//         var updatedDebitTransaction = await debitTransactionModel.findByIdAndUpdate({user_id:req.body.user_id,account_id:req.body.account_id}, query, { new:true });
//         res.json({
//             status:true,
//             message:"updated successfully!",
//             data: updatedDebitTransaction
//         });
//     }catch(error){
//         res.json({
//             status:false,
//             message: error.message
//         });
//     }
    
//     }

//delete user's debited transaction controller
const deleteDebitTransaction = async( req, res ) =>{
    try{
        var deletedDebitTransaction = await debitTransactionModel.findByIdAndUpdate({_id:req.body.transaction_id},{delete:true},{ new:true });
        res.json({
            status:true,
            message:`${deletedDebitTransaction.nickname} deleted successfully!`
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
 }

//get all debit transaction for a specific user's account id  controller
const getUserAllDebitTransaction = async( req, res ) =>{
    try{
        var getUserAllDebitTransaction = await debitTransactionModel.find({user_id:req.params.user_id,account_id:req.params.account_id, delete:false});
        if(getUserAllDebitTransaction.length > 0){
            res.json({
                status:true,
                Total_length:getUserAllDebitTransaction.length,
                data: getUserAllDebitTransaction
            });
        }else{
            throw new Error('No debit transaction exist for this user account!');
        }
      
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
}

//get account balance for specific user's account in native currency and in USD  controller
const getAccountBalance = async( req, res ) =>{
    try{
        var getUserAccountBalance = await userAccountModel.findOne({user_id:req.params.user_id, _id:req.params.account_id, delete:false});
        var data ={};
        data.account_currency = getUserAccountBalance.account_currency;
        data.account_balance_in_native_currency = getUserAccountBalance.account_balance;
        // data.account_balance_in_USD = 0;
        var response = await axios.get(
            "https://comms.globalxchange.com/forex/convert",
            {
              params: {
                buy: 'USD',
                from: getUserAccountBalance.account_currency,
              },
            }
          );
          var cur_array = Object.values(response.data);
          data.account_balance_in_USD = Number(getUserAccountBalance.account_balance) * cur_array[2];

        res.json({
            status:true,
            data: data
        });
     
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
}

module.exports = {
    doDebitTransaction,
    // updateDebitTransaction,
    deleteDebitTransaction,
    getUserAllDebitTransaction,
    getAccountBalance
}