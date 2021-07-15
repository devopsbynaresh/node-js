const ProfileDetailModel = require('./../Models/ProfileDetailSchema');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const { db } = require("./../server");

//(CREATE) profile data template added by admin
const addProfileDetailTemplate = async (req, res) => {
    try{
        const pd = await ProfileDetailModel.create(req.body);
        // console.log(pd, 'created in db---------');
        res.json({
            status: true,
            data: pd
        })
    }catch(error){
        res.json({
            status: false,
            message: error.message
        })
    }
};

//(READ) get profile data template 
const listProfileDetailTemplate = async (req, res) => {
    try{
        var pd;
        if( req.params.user_role !== undefined ){
            var query = {
                user_role: req.params.user_role,
                delete: false
            }
            // console.log(req.params,'params---------',query);
             pd = await ProfileDetailModel.find(query);
        }else if(req.params.user_role === undefined){
             pd = await ProfileDetailModel.find({delete: false});
        } 
        res.json({
            status: true,
            Total_template: pd.length,
            data: pd
        });
    }catch(error){
        res.json({
            status: false,
            message: error.message
        });
    }
};

//(DELETE) DELETE profile data template 
const deleteProfileDetailTemplate = async (req, res) => {
    try{
        const pd = await ProfileDetailModel.findByIdAndUpdate(req.body.id, {delete: true}, {new: true}) ;
        // console.log(pd, 'deleted in db---------');
        res.json({
            status: true,
            data: pd
        })
    }catch(error){
        res.json({
            status: false,
            message: error.message
        })
    }
};

//(UPDATE) profile data template UPDATED by admin (WILL DO LATER)
const updateProfileDetailTemplate = async (req, res) => {
    try{
        const pd = await ProfileDetailModel.findById({ _id : req.body.id });
        // console.log(pd,'db----');
        // console.log(req.body, 'req.body-----');
        // var objFromDB = pd.tier_struct ;
        // var objFromReq = req.body;
        // const propertyNames = Object.keys(objFromDB);
        // const propertyNamesReq = Object.keys(objFromReq);
        // var k = [];

// console.log(propertyNames, propertyNamesReq);
// for( var i = 0; i < propertyNames.length;  i++){
//     // console.log(propertyNames[i]);
//     var t= propertyNames.find(propertyNames[i]);
//     console.log(t)
// for( var j = 0; j < propertyNamesReq.length ; j++){
//     if( propertyNames[i] !== propertyNamesReq[j]){
//         console.log( k, 'pushing---------');
//         // k.push(propertyNames[i]);
//     }
// // }
// var f = propertyNamesReq.find(propertyNames[i]);
// console.log(f);
// // k.push(propertyNames[i]);

// }
// console.log( k, 'final---------');
// var g = propertyNames.find('f-name');
// console.log(g ) ;
    //    var arrayObjFromDB = [];
    //    for( var value in objFromDB){
    //     // //    var e = {value + ': '+ objFromDB[value]}
    //     //    arrayObjFromDB.push({value + ': ' + objFromDB[value]})
    //     //    console.log( value + ': '+ objFromDB[value]);
    //    }

        // var result = JSON.parse( objFromDB);
        // console.log(JSON.parse(`req.body`) );

        // const pd = await ProfileDetailModel.findByIdAndUpdate(req.body.id,  req.body , {new: true}) ;
        // for( x in pd ){
        //     console.log(x);
        // }
        
        res.json({
            status: true,
            data: pd
        });
    }catch(error){
        console.log(error.message, 'error---------');
        res.json({
            status: false,
            message: error.message
        })
    }
};

//(READ) get profile data template for a specific user and profile-detail-template
const getProfileDetailTemplate = async (req, res) => {
    try{
        
             var pd = await ProfileDetailModel.find(req.query);
            //  console.log(pd,'lll');
        
        res.json({
            status: true,
            data: pd[0].tier_struct
        });
    }catch(error){
        res.json({
            status: false,
            message: error.message
        });
    }
};

//profile data value created by user 
const fillProfileDetailForm = async (req, res,client) => {
    try{
       var collectionName = req.body.user_role + '_' + req.body.tier_name;
       await db.collection(collectionName).insert(req.body, function(err, res) {
            if (err) throw err;
            // console.log("1 document inserted");
          });
          res.json({
            status: true,
            message: 'inserted successfully!',
            data: req.body
        });
        
    }catch(error){
        console.log(error.message, 'error-------');
        res.json({
            status: false,
            message: error.message
        });
    }
}

//profile data element deleted by user 
const deleteProfileDetailTierElement = async (req, res) => {
    try{
        // console.log(req.body);
       var collectionName = req.body.user_role + '_' + req.body.tier_name;
        await db.collection(collectionName).findOneAndUpdate({ _id: new ObjectID(req.body.id) }, {  $set:{ "delete": true}},
        function(err, res) {
                    if (err) throw err;
                    console.log("1 document deleted!");
                  });
          res.json({
            status: true,
            message: 'deleted successfully!',
            // data: req.body
        });
    }catch(error){
        console.log(error.message, 'error-------');
        res.json({
            status: false,
            message: error.message
        });
    }
}

//profile data value updated by user 
const updateProfileDetailTierElement = async (req, res) => {
    try{
        // console.log(req.body);
       var collectionName = req.body.user_role + '_' + req.body.tier_name;
       await db.collection(collectionName).updateOne({ _id: new ObjectID(req.body.id) }, { $set:{ "tier_struct": req.body.tier_struct}},
        function(err, res) {
                    if (err) throw err;
                    // console.log("1 document updated!");
                  });
          res.json({
            status: true,
            message: 'updated successfully!',
            // data: req.body
        });
    }catch(error){
        console.log(error.message, 'error-------');
        res.json({
            status: false,
            message: error.message
        });
    }
}

//profile data value updated by user 
const getListProfileDetailTierElement = async (req, res) => {
    try{
        // console.log(req.query, 'ooooooooooo');
       var collectionName = req.query.user_role + '_' + req.query.tier_name;
       //Listing single users data
        if(req.query.id){
             var docs = await db.collection(collectionName).findOne({_id: ObjectID(req.query.id.toString())});
             res.json({
                        status: true,
                        docs: docs
                    });
        }else {
            var data = [{}];
            //listing all users data
                await db.collection(collectionName).find({ delete: false}).toArray( function(err, docs){
                    if(err) throw err;
                    data = docs;
                    console.log(docs, 'docssssss');
                    res.json({
                        status: true,
                        Total_length: docs.length,
                        message: 'Listed successfully!',
                        data: docs
                    });
                });
        }
  
    }catch(error){
        console.log(error.message, 'error-------');
        res.json({
            status: false,
            message: error.message  
        });
    }
}

module.exports = {
    addProfileDetailTemplate,
    listProfileDetailTemplate,
    updateProfileDetailTemplate,
    deleteProfileDetailTemplate,
    getProfileDetailTemplate,
    fillProfileDetailForm,
    deleteProfileDetailTierElement,
    updateProfileDetailTierElement,
    getListProfileDetailTierElement
   
}