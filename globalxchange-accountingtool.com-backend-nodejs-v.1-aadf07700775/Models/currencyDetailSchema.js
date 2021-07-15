const mongoose = require('mongoose');

//schema for currency detail
const currencyDetailSchema = new mongoose.Schema({
    currency_type:String,
    full_name:String,
    currency_code:String,
    currency_icon: String,//image of icon
    currency_issuing_country:String,
    currency_symbol:String,
    delete:{ type:Boolean, default:false }
});

module.exports= mongoose.model('currency_detail', currencyDetailSchema);
