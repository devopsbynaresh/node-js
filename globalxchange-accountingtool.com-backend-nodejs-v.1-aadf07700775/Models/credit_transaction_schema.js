const mongoose = require('mongoose');


//credit transaction  schema
const creditTransactionSchema = new mongoose.Schema({
    user_id: String,
    account_id:String,
    counterparty_id:String,
    date:Date,
    credit_initiation_currency:String,
    ammount_in:Number,
    nickname:String,
    icon:String,
    description:String,
    ledger_changes:{type:Number, default:0},
    updated_balance:{type:Number, default:0},
    delete:{type:Boolean, default:false}
  
},
{timestamps: true});
module.exports = new mongoose.model('credit_transaction_model', creditTransactionSchema);
