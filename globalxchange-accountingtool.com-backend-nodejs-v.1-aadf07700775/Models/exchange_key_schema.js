const mongoose = require('mongoose');

/**
 * external exchange connected to accounting tool schema
 */
const exchangeApiKeySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        
    },
  exchange_name: String,
  exchange_connection_requirement:{}
},
{
    timestamps: true
});

const exchange_api_key = mongoose.model('exchange_api_key', exchangeApiKeySchema);
module.exports = exchange_api_key;