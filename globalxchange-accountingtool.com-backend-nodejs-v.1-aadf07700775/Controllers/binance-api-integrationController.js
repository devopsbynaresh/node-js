
// using ccxt trying to integrate binance
'use strict';
var ccxt = require ('ccxt');
const Binance = require('binance-api-node').default;
const request = require('request');

const binanceApiKeySchema = require('../Models/exchange_key_schema');
 
const binanceApiIntegration = async (req, res) =>{
    try{
        // console.log (ccxt.exchanges)
const client2 = Binance({
    apiKey: req.body.exchange_connection_requirement.apiKey,
    apiSecret: req.body.exchange_connection_requirement.apiSecret,
  //   getTime: xxx, // time generator function, optional, defaults to () => Date.now()
  });
//   console.log(clien2, 'llllllllllllllllll');
  var AtMemberOrNot = await binanceApiKeySchema.findOne({email: req.body.email});
  
  if(AtMemberOrNot === null){
   await binanceApiKeySchema.create(req.body);
  }
  
  var depositList = await client2.depositHistory({recvWindow:59999});
  var withdrawList = (await client2.withdrawHistory({recvWindow:59999}));
  if(depositList.depositList.length > 0 || withdrawList.withdrawList.length > 0 ){
      res.json({
          status:true,
          message:'connection established between accounting tool and binance!',
          depositHistory: depositList,
          withdrawHistory: withdrawList
      });
  }else{
      res.json({
          status:true,
          message:'connection established between accounting tool and binance!',
          transactionHistory: 'no transaction done for this account yet!'
      });
  }
    }
    catch(error){
        res.json({
            status: false,
            message: error.message
        })
    }

        //listing  withdrawHistory

//      var opsn=exchange.sign("withdrawHistory","wapi");
//        console.log(opsn,'jjjjjjjjjjjjjjjjjj');
//      request.get(opsn,function(err,data,body){
//         console.log(body);
//         res.json({
//             status:true,
//             depositHistory:JSON.parse(body)
//         })
        
//     })
}

//doing withdrawal from accounting tool api

const withdrawalApi = async (req, res) =>{
    var AtMemberOrNot = await binanceApiKeySchema.findOne({email: req.query.email});
 
    const exchangeId = 'binance'
        , exchangeClass = ccxt[exchangeId]
        , exchange = new exchangeClass ({
            'apiKey': AtMemberOrNot.apiKey,
            'secret': AtMemberOrNot.apiSecret,
            'timeout': 30000,
            'enableRateLimit': true,
        });
    
    
    //requesting  withdrawal
    
    var opsn=exchange.sign("withdraw","wapi");
    opsn.params = 
        {
            asset: req.query.asset,
            address: req.query.address,
            amount: Number(req.query.amount)
        }
    request.post(opsn,(err,data,body)=>{
     res.json({
         status:true,
         withdraw:JSON.parse(body)
     })
    });
}

//get tradeHistory of a symbol

const getTradeHistory = async (req, res) =>{
    var AtMemberOrNot = await binanceApiKeySchema.findOne({email: req.query.email});
 
    const client2 = Binance({
        apiKey: AtMemberOrNot.apiKey,
        apiSecret: AtMemberOrNot.apiSecret,
      //   getTime: xxx, // time generator function, optional, defaults to () => Date.now()
      });
    
    //requesting  withdrawal
    var trades = await client2.myTrades({
        symbol: req.query.symbol,
        recvWindow:59999
      });
  
     res.json({
         status:true,
         symbol: req.query.symbol,
         tradeHistory:trades
     })
    
}

//create order

const createOrder = async (req, res) =>{
    var AtMemberOrNot = await binanceApiKeySchema.findOne({email: req.query.email});
    console.log(AtMemberOrNot, '--------------');
 
    const client2 = Binance({
        apiKey: AtMemberOrNot.apiKey,
        apiSecret: AtMemberOrNot.apiSecret,
      //   getTime: xxx, // time generator function, optional, defaults to () => Date.now()
      });
      
     var order =  await client2.order({
          symbol: req.query.symbol,
          side: req.query.side,
          quantity: req.query.quantity,
          price: req.query.price,
          recvWindow:59999
        })
      
      console.log('order created-----------------')
   
  
     res.json({
         status:true,
         order:order
     })
    
}

module.exports = {
    binanceApiIntegration,
    withdrawalApi,
    getTradeHistory,
    createOrder
}