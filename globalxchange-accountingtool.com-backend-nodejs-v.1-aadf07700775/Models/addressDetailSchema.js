const mongoose = require('mongoose');


//one location address schema
const addressDetailSchema = new mongoose.Schema({
    building_name:String,
    street_number:Number,
    street_name:String,
    apt:String,
    country_name:String,
    country_code: String,
    phone_number:String,
    state:String,
    city:String,
    postal_code:String,
    branch_id:String,
    image: [String],
    branch_name:String,
    routing_number:String,
    branch_transit_number: String,
    open_hours:String,
    email:String,
    website:String,
    ifsc_code:String,
    micr_code:String,
    delete:{ type:Boolean, default:false }
});

module.exports = mongoose.model('address_detail', addressDetailSchema);
