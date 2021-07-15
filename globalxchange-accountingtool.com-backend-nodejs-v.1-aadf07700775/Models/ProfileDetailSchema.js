const mongoose = require('mongoose');

/**
 * Profile data details Tier  schema
 */
const profileDataTierSchema = new mongoose.Schema({
    tier_name: String,
    user_role: String,
    delete: {
        type:Boolean,
        default:false
    },
    tier_struct:{}
    // tier_data_type:[{type:String}]
},{timestamps: true});

module.exports = mongoose.model('profile_detail_tier', profileDataTierSchema);
