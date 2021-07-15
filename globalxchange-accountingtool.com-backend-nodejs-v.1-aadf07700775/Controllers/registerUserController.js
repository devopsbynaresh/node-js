const Register_user = require('../Models/accountingToolRegisterUser');
const axios = require('axios');
const uuid = require('uuid');

//create unique id 
const createUniqueId = ( key ) => {
    let unique = uuid.v4();
    unique = unique.split("-");
    unique = unique[unique.length - 1];
    let timestamp = Date.now();

 return (key +"u1"+ unique + "t" + timestamp);
}

//register and login for accounting tool user 
const registerUser = async (req, res) => {
    try{
        const accountingToolUser =  await Register_user.find({ email: req.body.email});
        if( accountingToolUser.length > 0){
            res.status(200).json({
                status: 'true',
                message :' logged in as accounting tool user!',
                data: accountingToolUser[0]
            });
        }
        else{
            const response = await axios.post('https://comms.globalxchange.com/gxb/apps/register/user', {
                email: req.body.email, // user email
                app_code: "accountingtool"  // app_code
              });
              const newAccountingUser = {
                  email: req.body.email,
                  mobileNumber: req.body.mobileNumber,
                  profile_id: response.data.profile_id,
                  affiliate_id: response.data.affiliate_id,
                  name: response.data.name
              };
            
              if(response.data.status === true ){
                const registeredUser = await Register_user.create(newAccountingUser);
                  res.status(200).json({
                      status: 'true',
                      message :' registered as accounting tool user!',
                      data: registeredUser
                  });
              }
              else{
                  throw new Error(response.data.message);
              }

        }    

    }catch(error){
        // console.log(error.message, 'inside catch block-----');
        res.json({
            status: 'false',
            message : error.message
        });
    };
    
}

//get all accounting tool users list
const getUsersList = async (req, res) => {
    try{
        const accountingToolUsersList =  await Register_user.find({});
        if( accountingToolUsersList.length > 0){
            res.status(200).json({
                status: 'true',
                Total_User:accountingToolUsersList.length,
                data: accountingToolUsersList
            });
        }
        else{
            res.status(200).json({
                status: 'true',
                Total_User:accountingToolUsersList.length,
                data: 'No User Registered Yet!'
            });
    }
   }
    catch(error){
        // console.log(error, 'catch block------')
        res.json({
            status: 'false',
            data: error.message
        });
    }

}

//register and login accounting tool corporate user
const registerCorporateUser = async (req, res) => {
    try{
        // console.log('doing find qury to mongo again...........');
        const accountingToolUser =  await Register_user.find({ email: req.body.email});
        const response = await axios.post('https://comms.globalxchange.com/gxb/apps/register/user', {
                email: req.body.email, // user email
                app_code: "gx_business_account"  // app_code
              });
        
        if( accountingToolUser.length === 0 )
        {
            throw new Error('Not A accounting tool user Yet!');
        }
        if( response.data.status === false)
        {
            throw new Error(response.data.message);
        }
        
        if( accountingToolUser.length > 0 && accountingToolUser[0].atCorporate_account === true ){
            const data = {
                email: accountingToolUser[0].email,
                atCorporate_account : accountingToolUser[0].atCorporate_account,
                atCorporate_User_id : accountingToolUser[0].atCorporate_User_Id
            };
            res.status(200).json({
                status: 'true',
                message :' logged in as accounting tool Corporate user!',
                data: data
            });
        }
        else{
    
            if(accountingToolUser.length > 0 && response.data.status === true){
                const atCorporate_User_id = createUniqueId( "cor" );
                // console.log(atCorporate_User_id, 'created user id=========');
                let updateValue = {
                    atCorporate_User_Id: atCorporate_User_id,
                    atCorporate_account:true
                }

                const registerATUser =  await Register_user.findByIdAndUpdate({ _id:accountingToolUser[0]._id}, updateValue);  
                // console.log(accountingToolUser[0], 'accounting tool---------') 
                const registeredUser = {
                email: registerATUser.email,
                atCorporate_account : true,
                atCorporate_User_Id : atCorporate_User_id
                };
                res.status(200).json({
                    status: 'true',
                    message :' registered as accounting tool Corporate user!',
                    data: registeredUser
                });

            }
        
        }
   }
    catch(error){

        res.json({
            status: 'false',
            data: error.message
        });
    }

}

//get all list of AT_Corporate users 
const getATCorporateUsersList = async (req, res) => {
    try{
       
        const atCorporateUsersList =  await Register_user.find(req.query);
        if( atCorporateUsersList.length > 0 ){
            res.status(200).json({
                status: 'true',
                Total_User:atCorporateUsersList.length,
                data: atCorporateUsersList
            });
        }
        else{
            res.status(200).json({
                status: 'true',
                Total_User:atCorporateUsersList.length,
                data: 'No AT_Corporate User Registered Yet!'
            });
    }
       
  
   }
    catch(error){

        res.json({
            status: 'false',
            data: error.message
        });
    }

}


module.exports = {
    registerUser,
    getUsersList,
    registerCorporateUser,
    getATCorporateUsersList
}