const mongoose = require('mongoose');

/**
 * accounting tool user schema
 */
const userRegisterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        
    },
    mobileNumber: String,
    profile_id: String,
    affiliate_id: String,
    name: String,
    atCorporate_account: {
        type: Boolean,
        default: false
    },
    atCorporate_User_Id: {
        type: String,
        default: null
    }
},
{
    timestamps: true
});

const Register_user = mongoose.model('Register_user', userRegisterSchema);
module.exports = Register_user;