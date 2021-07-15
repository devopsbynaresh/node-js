const mongoose = require('mongoose');

const userAccountSchema = mongoose.Schema({
    user_id: String,
    institute_id:String,
    account_balance:{ type:Number, default:0},
    account_currency:String,
    account_nickname:String,
    account_icon:String,
    account_description:String,
    delete:{type:Boolean, default:false}
}, {timestamps: true});

module.exports = mongoose.model('user_account_detail', userAccountSchema);