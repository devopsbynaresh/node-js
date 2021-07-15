const mongoose = require('mongoose');
const express = require('express');
const MongoClient = require('mongodb').MongoClient ;
const assert = require('assert');

const app = express();

app.use(express.json());

//cors policy enabling
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  
//connection string for mongodb Atlas
// const constr="mongodb+srv://lovely:0V04fYYzlyA4HY0s@nvestdb.zzqa4.mongodb.net/nvestportal?retryWrites=true&w=majority";
const remote_connection = "mongodb+srv://lovely:Z5Dv8wlFQYplj8yp@cluster0.ecdne.mongodb.net/nvestportal?retryWrites=true&w=majority";
const local_constr="mongodb://localhost:27017/accountingToolDB";

//MONGODB CONNECTION TO NODEJS APP
mongoose.connect(remote_connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>  console.log('DB connected successfully!'));


//native mongodb driver
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'accountingToolDB';
const remoteDB = 'nvestportal';
var connectDB = async ()=>{
    return new Promise(function(resolve, reject) {
        MongoClient.connect( remote_connection, { useUnifiedTopology: true },
        function(err, database) {
          if (err) {
            console.log(err);
            process.exit(1);
          } 
          // Save database object from the callback for reuse.
          var db = database.db("nvestportal");
          resolve(db);
          console.log("nvestportal Database connection ready");
          return ;
        }
      );
    });
  }
  var dbconnect;
 const start_db_con = async ()=>{
    dbconnect = await connectDB();

    module.exports = {
       db: dbconnect
    };

    const registerUserController = require("./Controllers/registerUserController");
    const profileDetailTierController = require("./Controllers/profileDetailsTierController");
    const asset_Liability_Calculator_controller = require("./Controllers/asset_Liability_calculator_controller");
    const instituteController = require('./Controllers/instituteController');
    const userAccountController = require('./Controllers/userAccountController');
    const userCounterPartyController = require('./Controllers/userCounterpartyController');
    const debit_transaction_controller = require('./Controllers/debit_transaction_controller');
    const credit_transaction_controller = require('./Controllers/credit_transaction_controller');
    const binance_api_integration_controller = require('./Controllers/binance-api-integrationController');
    const exchange_controllers = require('./Controllers/exchangeControllers');
    const attachedAccountController = require('./Controllers/attachAccountController');

    //accounting tool user registration and login api
    app.post('/registeruser', registerUserController.registerUser);


    //list all accounting tool user
    app.get('/accountingtooluserslist', registerUserController.getUsersList);

    //accounting tool Corporate_User registration and login api
    app.post('/registerATCorporateUser', registerUserController.registerCorporateUser);

    //get list Of all AT_Corporate user
    app.get('/allAtCorporateUsersList', registerUserController.getATCorporateUsersList);

    //create profile detail template api
    app.post('/create-profile-detail-template', profileDetailTierController.addProfileDetailTemplate);

    //list profile detail template api
    app.get('/list-profile-detail-template/:user_role?', profileDetailTierController.listProfileDetailTemplate);

    //delete profile detail template api
    app.post('/delete-profile-detail-template', profileDetailTierController.deleteProfileDetailTemplate);

    //update profile detail template api
    app.patch('/update-profile-detail-template', profileDetailTierController.updateProfileDetailTemplate);

    //Get API to get profile detail template for a specific user and profile detail tier
    app.get('/get-profile-detail-structure', profileDetailTierController.getProfileDetailTemplate);

    //fill profile data tier value for  different users api
    app.post('/fill-profile-detail-tier-form-template', profileDetailTierController.fillProfileDetailForm);

    //delete profile data tier element  api
    app.post('/delete-profile-detail-tier-element', profileDetailTierController.deleteProfileDetailTierElement);

     //update profile data tier element  api
     app.post('/update-profile-detail-tier-element', profileDetailTierController.updateProfileDetailTierElement);

    //get list of  profile data tier element  api
    app.get('/getList-profile-detail-tier-element', profileDetailTierController.getListProfileDetailTierElement);

    //calculate asset and liability  api
    app.post('/calculate-assests-and-liabilities', asset_Liability_Calculator_controller.assetLiabilityCalculator);

    //calculating cash position for asset and liability
    app.get('/get-cash-position', asset_Liability_Calculator_controller.cashPosition);

    //add institution by admin (create api)
    app.post('/add-institute', instituteController.addInstitute);

    //add specific institution's location by admin (create api)
    app.post('/add-institute-location', instituteController.addInstituteLocation);

    //add specific institution's currency by admin (create api)
    app.post('/add-institute-currency', instituteController.addInstituteCurrency);

    //add specific institution's additional link by admin (create api)
    app.post('/add-institute-additional-link', instituteController.addInstituteAdditionalLink);

    //update institution by admin (update api)
    app.post('/update-institute', instituteController.updateInstitute);
    
    //update specific institution's location by admin (update api)
    app.post('/update-institute-location', instituteController.updateInstituteLocation);

    //update specific institution's currency by admin (update api)
    app.post('/update-institute-currency', instituteController.updateInstituteCurrency);

    //update specific institution's additional link by admin (update api)
    app.post('/update-institute-additional-link', instituteController.updateInstituteAdditionalLink);

    // delete one institutes by admin (delete api)
    app.post('/delete-institute', instituteController.deleteInstitute);

    //delete specific institute's currency by admin (delete api)
    app.post('/delete-institute-currency', instituteController.deleteInstituteCurrency);

    
    //delete specific institute's location by admin (delete api)
    app.post('/delete-institute-location', instituteController.deleteInstituteLocation);

    //delete specific institute's additional-link by admin (delete api)
    app.post('/delete-institute-additional-link', instituteController.deleteInstituteAdditionalLink);
    
    //GET LIST Of institutes by admin (GET api)
    app.get('/getlist-of-institutes', instituteController.getListOfInstitute);

    //GET LIST institutes of a country by admin (GET api)
    app.get('/getlist-of-institutes_By_Country/:country_name', instituteController.listInstitutesOfACountry);

    //GET LIST institutes of a country's state by admin (GET api)
    app.get('/getlist-of-institutes_By_state/:state', instituteController.listInstitutesOfACountry_state);

    //GET LIST institutes of a country's city by admin (GET api)
    app.get('/getlist-of-institutes_By_city/:city', instituteController.listInstitutesOfACountry_city);

    //GET LIST institutes by institute type by admin (GET api)
    app.get('/getlist-of-institutes_By_institute_type/:institute_type', instituteController.listInstitutesByInstituteType);

    //GET LIST institutes by currency type by admin (GET api)
    app.get('/getlist-of-institutes_By_currency_type', instituteController.listInstitutesByCurrencyType);

    //GET A institute by id (GET api)
    app.get('/get-single-institute/:id', instituteController.listAInstitute);

  /*User account_detail All CRUD api below*/

  // Add user account api
  app.post('/add-user-account', userAccountController.addUserAccount );

  // update user account api
  app.post('/update-user-account/:account_id', userAccountController.updateUserAccount );

  // delete user account api
  app.post('/delete-user-account', userAccountController.deleteUserAccount );
  
  //get account-detail for a specific user api
  app.get('/get-user-account/:user_id', userAccountController.getUserAccount );

   /*User's counterparty All CRUD api below*/

  // Add user counterparty api
  app.post('/add-user-counterparty', userCounterPartyController.addCounterparty );

  // update user counterparty api
  app.post('/update-user-counterparty/:counterparty_id', userCounterPartyController.updateUserCounterparty );

  // delete user counterparty api
  app.post('/delete-user-counterparty', userCounterPartyController.deleteUserCounterparty );
  
  //get all  counterparty  for a specific user api
  app.get('/get-user-counterparty/:user_id', userCounterPartyController.getUserCounterparty );

   //get list of all central  counterparty  api
   app.get('/get-central-counterparty', userCounterPartyController.getCentralCounterpartyList );

  /*User's debit transaction All CRUD api below*/

  // Add user debit transaction api
  app.post('/add-user-debit_transaction', debit_transaction_controller.doDebitTransaction );

  // update user debit transaction api
  // app.post('/update-user-debit_transaction', debit_transaction_controller.updateDebitTransaction );

  // delete user debit transaction api
  app.post('/delete-user-debit_transaction', debit_transaction_controller.deleteDebitTransaction );
  
  //get all debit transaction  for a specific user api
  app.get('/get-user-debit_transaction/:user_id/:account_id', debit_transaction_controller.getUserAllDebitTransaction );

  
  /*User's credit transaction All CRUD api below*/

  // Add user credit transaction api
  app.post('/add-user-credit_transaction', credit_transaction_controller.doCreditTransaction );

  // update user credit transaction api
  // app.post('/update-user-debit_transaction', debit_transaction_controller.updateDebitTransaction );

  // delete user credit transaction api
  app.post('/delete-user-credit_transaction', credit_transaction_controller.deleteCreditTransaction );
  
  //get all credit transaction  for a specific user api
  app.get('/get-user-credit_transaction/:user_id/:account_id', credit_transaction_controller.getUserAllCreditTransaction);

  //get account balance for specific user's account in native currency and in USD  controller
  app.get('/get-account-balance/:user_id/:account_id', debit_transaction_controller.getAccountBalance);

  /*
  integrating 3rd party api
  binance account's integrated in accounting-tool's accoint api 
  */
  app.post('/binance-account-integration', binance_api_integration_controller.binanceApiIntegration);
/*
  withdrawal api where withdrawal can be done from accounting tool 
  */
  app.post('/withdraw', binance_api_integration_controller.withdrawalApi);

  /*
  Get api for tradeHistory of a specific symbol
  */
 app.get('/trade_history', binance_api_integration_controller.getTradeHistory);

   /*
  create order api from accounting tool
  */
 app.post('/create_order', binance_api_integration_controller.createOrder);

  /*
  add exchange in accounting tool api
  */
 app.post('/add_exchange', exchange_controllers.addExchange);

  /*
  get list of all accounting tool user who is coonected to external exchanges
  */
 app.get('/list_of_accountingTool_users_connected_to_exchanges', exchange_controllers.getlistofUsersConnectedToExchanges);

 /*
  attaching account to institution........
  */
 app.post('/attach_account_to_institution', attachedAccountController.attachAccountToInstitution);

 /*
  updated account attached  to institution........
  */
 app.post('/update_account_to_institution', attachedAccountController.editattachedAccountToInstitution);

 /*
  delete account attached  to institution........
  */
 app.post('/delete_account_to_institution', attachedAccountController.deleteattachedAccountToInstitution);

 /*
  get api to list detail of  account attached to institution
  */
 app.get('/get_account_detail_to_institution', attachedAccountController.getDetailOfAccountAttachedToInstitution);

  /*
  list accounts per user........
  */
app.get('/list_accounts_per_user', attachedAccountController.getAllAccountsPerUser);

 /*
  list accounts per institutions........
  */
 app.get('/list_accounts_per_institution', attachedAccountController.getAllAccountsPerInstitutions);
}
start_db_con();

const port = 3050;
app.listen(port, ()=>{
    console.log( `App is listening at port ${port}..... `);
});
