const _ = require('lodash');
const axios = require("axios");

const creditTransactionModel = require('../Models/credit_transaction_schema');
const userAccountModel = require('../Models/userAccountModel');

//doing a credit function
const doCreditTransaction = async( req, res ) =>{
    try{
        var credit = {...req.body};
        var userAccount = await userAccountModel.findOne({_id:req.body.account_id, delete: false});
        if( req.body.credit_initiation_currency === userAccount.account_currency){
            userAccount.account_balance = Number(userAccount.account_balance + req.body.ammount_in);
            credit.updated_balance = userAccount.account_balance;
            credit.ledger_changes = Number( credit.ammount_in);
        }
        else{
            var response = await axios.get(
                "https://comms.globalxchange.com/forex/convert",
                {
                  params: {
                    buy: userAccount.account_currency,
                    from: req.body.credit_initiation_currency,
                  },
                }
              );
              var cur_array = Object.values(response.data);
              var convertedAmmount = Number(req.body.ammount_in) * cur_array[2];
              userAccount.account_balance = Number(userAccount.account_balance + convertedAmmount);
              credit.updated_balance = userAccount.account_balance;
              credit.ledger_changes = Number(convertedAmmount);
        }
        var addedCreditTransaction = await creditTransactionModel.create(credit); 
        var updateAccount = await axios.post(`https://accountingtool.apimachine.com/update-user-account/${req.body.account_id}`, userAccount);
        res.json({
            status:true,
            message:"ammount credited successfully!",
            data: addedCreditTransaction
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

//delete user's credited transaction controller
const deleteCreditTransaction = async( req, res ) =>{
    try{
        var deletedCreditTransaction = await creditTransactionModel.findByIdAndUpdate({_id:req.body.transaction_id},{delete:true},{ new:true });
        res.json({
            status:true,
            message:`${deletedCreditTransaction.nickname} deleted successfully!`
        });
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
 }

//get all credit transaction for a specific user's account id controller
const getUserAllCreditTransaction = async( req, res ) =>{
    try{
        var getUserAllCreditTransaction = await creditTransactionModel.find({user_id:req.params.user_id,account_id:req.params.account_id, delete:false});
        if(getUserAllCreditTransaction.length > 0){
            res.json({
                status:true,
                Total_length:getUserAllCreditTransaction.length,
                data: getUserAllCreditTransaction
            });
        }else{
            throw new Error('No credit transaction exist for this user account!');
        }
      
    }catch(error){
        res.json({
            status:false,
            message: error.message
        });
    }
    
}

module.exports = {
    doCreditTransaction,
    // updateDebitTransaction,
    deleteCreditTransaction,
    getUserAllCreditTransaction
}