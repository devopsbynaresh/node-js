'use strict';

const exchangeModel = require('./../Models/accountingToolExchangeSchema');
const commonExchangeSchema = require('./../Models/exchange_key_schema');

//add exchange and verify that it can be integrated in accounting tool or not

const addExchange = async (req, res) =>{
   
    try{
        // console.log(req.body);
        if( req.body.exchange_name == 'binance' && req.body.exchange_connection_requirement.apiKey  && req.body.exchange_connection_requirement.apiSecret ){
            // res.json({
            //     status: true,
            //     message: 'binance exchange connection requirement not provided!'
            // });

            const addedExchange = await exchangeModel.create(req.body);
            // console.log(pd, 'created in db---------');
            res.json({
                status: true,
                message: 'exchange added!',
                data: addedExchange
            })
        }
        else{
            res.json({
                status: true,
                message: `${req.body.exchange_name} can not be added!`
                
            })
        }
       
    }catch(error){
        // console.log(error, 'kkkkkkkk');
        res.json({
            status: false,
            message: error.message
        })
    }
    
}

const getlistofUsersConnectedToExchanges = async (req, res) =>{
   
    try{
        const listOfAccountingToolUsersConnectedToExchanges = await commonExchangeSchema.find();
          if(listOfAccountingToolUsersConnectedToExchanges.length > 0){
            res.json({
                status: true,
                noOfUser:listOfAccountingToolUsersConnectedToExchanges.length,
                allAccountingToolUsers:listOfAccountingToolUsersConnectedToExchanges
                
            })
          }
          else{
            res.json({
                status: true,
                message: 'no accounting tool user connected to external exchanges yet!'
                
            })
          }
          
        
       
    }catch(error){
        res.json({
            status: false,
            message: error.message
        })
    }
}
    


module.exports = {
  
    addExchange,
    getlistofUsersConnectedToExchanges
}