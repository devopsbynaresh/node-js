const mongoose = require('mongoose');

/**
 * asset  schema
 */
const accountDetailSchema = new mongoose.Schema({
    account_name: String,
    currency_type: String,
    account_balance : Number,
    usd_balance: {
        type:Number,
        default:0
    }
});
const tolTypeLiabilityDetailSchema = new mongoose.Schema({
    tol_type: Number,
    liability_data: [accountDetailSchema],
    total_usd_balance : {
        type:Number,
        default:0
    }
});
const liabilitySchema = new mongoose.Schema({
    email: String,
    liability: Boolean,
    liability_detail:[tolTypeLiabilityDetailSchema]
},{timestamps: true});

module.exports = mongoose.model('liability_inputs', liabilitySchema);
