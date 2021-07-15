var _ = require('lodash');
const assetModel = require("../Models/assetSchema");
const liabilityModel = require("../Models/liabilitySchema");

const axios = require("axios");

//function trims numbers after decimal till 2 digit
const twoDecimalDigit = (num)=>{
   num = num.toString(); //If it's not already a String
   if(num.indexOf(".") > -1)
  num = num.slice(0, (num.indexOf("."))+3); //With 3 exposing the hundredths place
 return Number(num);
}

//function arrange account_balance 3.8989
const modifyAccountBalance = (num)=>{
  num = num.toString(); //If it's not already a String
  var index = num.indexOf(".");
  if( index == -1){
    return Number(num);
  }else if(index == 1 || index == 2 || index == 3 || index == 4) {
    num = num.slice(0, 6); 
  }
  else if( index > 4){ 
    num = num.slice(0,index);
  }
return Number(num);
}

//calculating total asset and liability
const assetLiabilityCalculator = async (req, res) => {
  try {
    if (req.body.asset === true) {
      // console.log(req.body.asset,'asset in req.body')     
      var insertData = req.body;
      for (var i = 0; i < req.body.asset_detail.length; i++) {
        var asset = {};
        var total_usd = 0;
        asset = req.body.asset_detail[i];
        // console.log("tol-type going to be calculated---", asset);
        var evens = _.remove(insertData.asset_detail[i].asset_data , function(doc) {
          return (doc.currency_type == "" || doc.account_name == "" || doc.account_balance == 0);
        }); 
        for (var j = 0; j < asset.asset_data.length; j++) {
          var account = {};
          account = asset.asset_data[j];
          if (account.currency_type === "USD") {
            account.usd_balance = Number(account.account_balance);
          } else {
            var cur = account.currency_type;
            var response = await axios.get(
              "https://comms.globalxchange.com/forex/convert",
              {
                params: {
                  buy: "USD",
                  from: cur,
                },
              }
            );
            var usd_cur = Object.values(response.data);
            account.usd_balance = Number(account.account_balance) * usd_cur[2];
          }
          insertData.asset_detail[i].asset_data[j] = account;
          total_usd = Number(total_usd) + Number(account.usd_balance);
        }
        insertData.asset_detail[i].total_usd_balance = Number(total_usd);
      }
      var data = await assetModel.create(insertData);

      res.json({
        status: true,
        data: data,
      });
    } else if (req.body.liability === true) {
      var insertData = req.body;
      for (var i = 0; i < req.body.liability_detail.length; i++) {
        var liability = {};
        var total_usd = 0;
        liability = req.body.liability_detail[i];
        var evens = _.remove(insertData.liability_detail[i].liability_data , function(doc) {
          return (doc.currency_type == "" || doc.account_name == "" || doc.account_balance == 0);
        }); 
        for (var j = 0; j < liability.liability_data.length; j++) {
          var account = {};
          account = liability.liability_data[j];
          if (account.currency_type === "USD") {
            account.usd_balance = Number(account.account_balance);
          } else {
            var cur = account.currency_type;
            var response = await axios.get(
              "https://comms.globalxchange.com/forex/convert",
              {
                params: {
                  buy: "USD",
                  from: cur,
                },
              }
            );
            var usd_cur = Object.values(response.data);
            account.usd_balance = Number(account.account_balance) * usd_cur[2];
          }
          insertData.liability_detail[i].liability_data[j] = account;
          total_usd = Number(total_usd) + Number(account.usd_balance);
        }
        insertData.liability_detail[i].total_usd_balance = Number(total_usd);
      }
      var data = await liabilityModel.create(insertData);

      res.json({
        status: true,
        data: data,
      });
    }
  } catch (error) {
    console.log(error.message, "error-------");
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//calculating cash position for asset and liability
const cashPosition = async (req, res) => {
    try {
        var tol_type = parseInt(req.query.tol_type);
    if( tol_type == 0 || tol_type == 7 || tol_type == 30 || tol_type == 90 ) {
      var asset = await assetModel.findOne({'email':req.query.email}).sort({$natural:-1}).limit(1);
      var oneAsset = await asset.asset_detail.filter( doc => doc.tol_type == req.query.tol_type);
      var liability = await liabilityModel.findOne({'email':req.query.email}).sort({$natural:-1}).limit(1);
      var oneLiability = await liability.liability_detail.filter( doc => doc.tol_type == req.query.tol_type);
    //   console.log(asset,'<--asset', oneAsset,'<----oneAsset')
    //   console.log(liability,'<--liavility', oneLiability,'<----onrLiability')
      var response = {};
      response.Total_Asset = twoDecimalDigit(oneAsset[0].total_usd_balance);
      response.Total_Liability =   twoDecimalDigit(oneLiability[0].total_usd_balance);
      response.Cash_Position = twoDecimalDigit( (oneAsset[0].total_usd_balance - oneLiability[0].total_usd_balance) );
      response.Asset_Breakdown = [{}];
      response.Liability_Breakdown = [{}];
      var asset_data = oneAsset[0].asset_data;
      var liability_data = oneLiability[0].liability_data;
      //asset breakdown
      for( var i=0; i< asset_data.length; i++){
          var account = {};
          account.usd_balance = twoDecimalDigit(asset_data[i].usd_balance) ;
          account.account_name = asset_data[i].account_name;
          account.currency_type = asset_data[i].currency_type;
          account.account_balance = modifyAccountBalance(asset_data[i].account_balance) ;
          account.percentage = ((asset_data[i].usd_balance * 100) / oneAsset[0].total_usd_balance) ;
          account.percentage =  twoDecimalDigit(account.percentage);
          response.Asset_Breakdown[i] = account;
      }
       //Liability breakdown
      for( var i=0; i< liability_data.length; i++){
          var account = {};
          account.usd_balance =  twoDecimalDigit(liability_data[i].usd_balance);
          account.account_name = liability_data[i].account_name;
          account.currency_type = liability_data[i].currency_type;
          account.account_balance = modifyAccountBalance( liability_data[i].account_balance) ;
          account.percentage = ((liability_data[i].usd_balance * 100) / oneLiability[0].total_usd_balance) ;
          account.percentage = twoDecimalDigit( account.percentage);
          response.Liability_Breakdown[i] = account;
      }
      res.json({
        status: true,
        data: response,
      });
    }
    else{
      throw new Error("Please enter valid TOL days!");
    }
      
    } catch (error) {
      console.log(error.message, "error-------");
      res.json({
        status: false,
        message: error.message,
      });
    }
  };

module.exports = {
  assetLiabilityCalculator,
  cashPosition
};
