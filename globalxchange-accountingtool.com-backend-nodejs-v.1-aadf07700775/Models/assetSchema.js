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
const tolTypeAssetDetailSchema = new mongoose.Schema({
    tol_type: Number,
    asset_data: [accountDetailSchema],
    total_usd_balance : {
        type:Number,
        default:0
    }
});
const assetSchema = new mongoose.Schema({
    email: String,
    asset: Boolean,
    asset_detail:[tolTypeAssetDetailSchema]
},{timestamps: true});

module.exports = mongoose.model('asset_inputs', assetSchema);
