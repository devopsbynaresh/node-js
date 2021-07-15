const mongoose = require('mongoose');

//schema for additional link
const additionalLinkSchema = new mongoose.Schema({
    link_name: String,
    link:String,
    delete:{ type:Boolean, default:false }
});

//institution schema
const institutionSchema = new mongoose.Schema({

    institute_name: { type:String, required: [true, 'institute name required!'], unique:[true, 'institute name must be unique!'] },
    short_name:{ type:String },
    institute_type: { type:String, required:[true, 'institute-type required!'] },
    profile_image:{ type:String, required:[true, 'profile image required!'] },
    cover_image: { type:String },
    Website: { type:String },
    country_name:{ type:String, default:"" },
    country_code: { type:String, default:"" },
    phone_number:{ type:String },
    swift_code:{ type:String, required: [true, 'swift code required!'], default:"" },
    color_code: { type:Array, required: [true, 'color code required!']},
    email:{ type:String },
    bank_id_name:{ type:String },
    bank_id:{ type:String },
    branch_id_name:{ type:String },
    account_id_name:{ type:String },
    additional_link:[additionalLinkSchema],
    all_supported_currency:[{ type: mongoose.Types.ObjectId, ref: 'currency_detail' }],
    locations:[{ type: mongoose.Types.ObjectId, ref: 'address_detail' }],
    delete:{ type:Boolean, default:false }
  
},
{timestamps: true});
module.exports = new mongoose.model('institute_model', institutionSchema);
