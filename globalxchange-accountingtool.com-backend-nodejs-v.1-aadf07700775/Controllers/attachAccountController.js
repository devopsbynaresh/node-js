const AccountAttachedToInstitutionModel = require('../Models/accountAttachedToInstitutionSchema');
const instituteModel = require('../Models/institutionSchema');
const accountingToolRegisterUserModel = require('../Models/accountingToolRegisterUser');


//post api to attach account to institution
const attachAccountToInstitution = async (req, res) => {
    try{
        // console.log(req.body,'kkkkkkkk')
        // var atRegisteredUser = await accountingToolRegisterUserModel.find({email: req.body.email_id});
        // console.log(atRegisteredUser,'found---------------');
    //     if('corporate_user'){
            const pd = await AccountAttachedToInstitutionModel.create(req.body);
    //      console.log(pd, 'created in db---------');
        res.json({
            status: true,
            data: pd
        })
    // }
    // else{
    //     res.json({
    //         status: true,
    //         message: 'you are not a Accounting_Tool_Corporate_User!'
    //     })
    // }
        
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

//get api to list detail of  account attached to institution
const getDetailOfAccountAttachedToInstitution = async (req, res) => {
    try{
       console.log(req.query,' query..............')
        const pd = await AccountAttachedToInstitutionModel.find({delete:false, _id: req.query.account_id});
         console.log(pd, 'created in db---------');
        res.json({
            status: true,
            data: pd
        })  
        
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

//edit api edit account which is attached to institution
const editattachedAccountToInstitution = async (req, res) => {
    try{

        var query = {};
        if(req.body){
             if(req.body.nick_name) query.nick_name = req.body.nick_name;
             if(req.body.institution_id) query.institution_id = req.body.institution_id;
             if(req.body.email_id) query.email_id = req.body.email_id;
             if(req.body.branch_id) query.branch_id = req.body.branch_id;
             if(req.body.account_id) query.account_id = req.body.account_id;
             if(req.body.currency) query.currency = req.body.currency;
             if(req.body.minimum_transfer_amount) query.minimum_transfer_amount = req.body.minimum_transfer_amount;
             if(req.body.maximum_transfer_amount) query.maximum_transfer_amount = req.body.maximum_transfer_amount;
            
        }
        console.log(query, 'query-------------');
        var updateAccounts = await AccountAttachedToInstitutionModel.findByIdAndUpdate(req.body._id, query, { new:true }) ;
        console.log(updateAccounts, 'updated--------------') ;
        res.json({
            status:true,
            message:"updated successfully!",
            data: updateAccounts
        });
        // console.log(req.body,'kkkkkkkk')
        // var atRegisteredUser = await accountingToolRegisterUserModel.find({email: req.body.email_id});
        // console.log(atRegisteredUser,'found---------------');
        
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

//delete api edit account which is attached to institution
const deleteattachedAccountToInstitution = async (req, res) => {
    try{
      
        var deletedAccounts = await AccountAttachedToInstitutionModel.findByIdAndUpdate(req.body._id, { delete:true },{new:true}) ;
        console.log(deletedAccounts, 'deleted------');
        res.json({
            status:true,
            // message:`${deletedAccounts.nick_name} deleted successfully!`,
            data: deletedAccounts
        });
        
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

// GET all accounts per user
const getAllAccountsPerUser = async (req, res) => {
    try{
       
        const pd = await AccountAttachedToInstitutionModel.find({ delete: false, email_id: req.query.email_id});
        const instituteDetail = await instituteModel.findById({_id: pd[0].institution_id});
       
        for(i in pd){
            pd[i].branch_id_name = instituteDetail.branch_id_name;
            pd[i].account_id_name = instituteDetail.account_id_name;
        }
        console.log(pd,'=-----------pppppppp')
      var accountIdName = instituteDetail.account_id_name;

        res.json({
            status: true,
            // result: result,
            no_of_user:pd.length,
            data: pd
        })
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

// GET all accounts per institutions
const getAllAccountsPerInstitutions = async (req, res) => {
    try{
       
        const pd = await AccountAttachedToInstitutionModel.find({ delete: false, institution_id: req.query.institution_id});
        const instituteDetail = await instituteModel.findById({_id: pd[0].institution_id});
       
        for(i in pd){
            pd[i].branch_id_name = instituteDetail.branch_id_name;
            pd[i].account_id_name = instituteDetail.account_id_name;
        }

        res.json({
            status: true,
            // result: result,
            no_of_institution:pd.length,
            data: pd
        })
    }catch(error){
        console.log(error.message);
        res.json({
            status: false,
            message: error.message
        })
    }
};

module.exports = {
attachAccountToInstitution,
editattachedAccountToInstitution,
deleteattachedAccountToInstitution,
getDetailOfAccountAttachedToInstitution,
getAllAccountsPerUser,
getAllAccountsPerInstitutions
   
}