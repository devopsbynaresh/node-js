const mongoose = require('mongoose');


//debit transaction  schema
const debitTransactionSchema = new mongoose.Schema({
    user_id: String,
    account_id:String,
    counterparty_id:String,
    date:Date,
    debit_initiation_currency:String,
    ammount_in:Number,
    nickname:String,
    icon:String,
    description:String,
    ledger_changes:{type:Number, default:0},
    updated_balance:{type:Number, default:0},
    delete:{type:Boolean, default:false}
  
},
{timestamps: true});
module.exports = new mongoose.model('debit_transaction_model', debitTransactionSchema);
