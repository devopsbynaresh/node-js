const mongoose = require('mongoose');

/**
 * exchange schema which will be integrated in accounting tool
 */
const exchangeSchema = new mongoose.Schema({
    exchange_name: { type:String, required: [true, 'exchange name required!'], unique:[true, 'exchange name must be unique!']},
    website: { type:String, required: [true, 'exchange name required!']},
    logo: { type:String, required: [true, 'exchange name required!']},
    exchange_description: { type:String, required: [true, 'exchange name required!']},
    delete: {
        type:Boolean,
        default:false
    },
    exchange_connection_requirement:{}
},{timestamps: true});

module.exports = mongoose.model('exchange_detail_schema', exchangeSchema);
