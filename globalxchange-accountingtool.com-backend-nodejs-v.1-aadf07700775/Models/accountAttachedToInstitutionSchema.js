const mongoose = require('mongoose');

/**
 * Profile data details Tier  schema
 */
const accountAttachedToInstitution = new mongoose.Schema({
    nick_name: String,
    email_id: String,
    institution_id: String,
    branch_id: String,
    branch_id_name: String,
    account_id: String,
    account_id_name:String,
    currency: String,
    minimum_transfer_amount: Number,
    maximum_transfer_amount: Number,
    delete: {
        type:Boolean,
        default:false
    },
    additional_data:{}
    
},{timestamps: true});

module.exports = mongoose.model('account_attached_to_institution', accountAttachedToInstitution);
