const mongoose = require('mongoose');

const userCounterpartySchema = mongoose.Schema({
    user_id: String,
    central:{type:Boolean, default:false},
    counterparty_name:String,
    counterparty_type:String,
    counterparty_description:{ type:String},
    counterparty_icon:{ type:String},
    delete:{type:Boolean, default:false}
}, {timestamps: true});

module.exports = mongoose.model('user_counterparty_detail', userCounterpartySchema);