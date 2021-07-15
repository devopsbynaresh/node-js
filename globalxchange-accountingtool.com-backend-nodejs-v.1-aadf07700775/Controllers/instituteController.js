const mongoose = require('mongoose');
const _ = require('lodash');
const multer = require('multer');

const instituteModel = require('../Models/institutionSchema');
const currencyModel = require('../Models/currencyDetailSchema');
const locationModel = require('../Models/addressDetailSchema');

/*
    Institute API used by ADMIN
*/
//Add institute

const addInstitute = async (req, res)=>{
    try{
        var insertInstitute = {...req.body};
        var currencyArray = req.body.all_supported_currency.filter( (ele => { return ele.currency_type == 'primary_currency'}));
        if(currencyArray.length === 0 ){
            throw new Error("please enter atleast one primary currency!");
        }
        else if( req.body.locations.length === 0 ){
            throw new Error("please enter atleast one valid location !");
        }
        var currencyAdded = await currencyModel.insertMany(req.body.all_supported_currency);
        var locationAdded = await locationModel.insertMany(req.body.locations);
        insertInstitute.all_supported_currency = currencyAdded.map( doc => doc._id );
        insertInstitute.locations = locationAdded.map( doc => doc._id );
        var insertedInstitute = await instituteModel.create(insertInstitute);
        res.json({
            status:true,
            message:"inserted successfully!"
            // data: insertedInstitute
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//Add institute's Location
const addInstituteLocation = async (req, res)=>{
    try{
        var institute_id = req.body.institution_id;
        delete req.body.institution_id;
        var locationAdded = await locationModel.create(req.body);
        var insertedInstitute = await instituteModel.findByIdAndUpdate({_id:institute_id} ,{ $push: { "locations": locationAdded._id }},{new:true});
        console.log('inserted----',insertedInstitute);

        res.json({
            status:true,
            message:"inserted successfully!"
            // data: insertedInstitute
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//Add institute's currency
const addInstituteCurrency = async (req, res)=>{
    try{
        var institute_id = req.body.institution_id;
        delete req.body.institution_id;
        var currencyAdded = await currencyModel.create(req.body);
        var insertedInstitute = await instituteModel.findByIdAndUpdate({_id:institute_id} ,{ $push: { "all_supported_currency": currencyAdded._id }},{new:true});
        console.log('inserted----',insertedInstitute);
        res.json({
            status:true,
            message:"inserted successfully!"
            // data: insertedInstitute
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//Add institute's Additional link { one or more than one additional link can be added at once}
const addInstituteAdditionalLink = async (req, res)=>{
    try{
        var institute_id = req.body.institution_id;
        // delete req.body.institution_id;
        var insertedInstitute = await instituteModel.findByIdAndUpdate({_id:req.body.institution_id} ,{ $push: { "additional_link": req.body.additional_link }},{new:true});
        res.json({
            status:true,
            message:"inserted additional link successfully!",
            // data: insertedInstitute
        });
       }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//update institute's basic details
const updateInstitute = async (req, res)=>{
    try{
        var query = {};
        if(req.body){
             if(req.body.institute_name) query.institute_name = req.body.institute_name;
             if(req.body.short_name) query.short_name = req.body.short_name;
             if(req.body.swift_code) query.swift_code = req.body.swift_code;
             if(req.body.color_code.length >0 ) query.color_code = req.body.color_code;
             if(req.body.institute_type) query.institute_type = req.body.institute_type;
             if(req.body.country_name) query.country_name = req.body.country_name;
             if(req.body.country_code) query.country_code = req.body.country_code;
             if(req.body.Website) query.Website = req.body.Website;
             if(req.body.phone_number) query.phone_number = req.body.phone_number;
             if(req.body.email) query.email = req.body.email;
             if(req.body.bank_id_name) query.bank_id_name = req.body.bank_id_name;
             if(req.body.bank_id) query.bank_id = req.body.bank_id;
             if(req.body.branch_id_name) query.branch_id_name = req.body.branch_id_name;
             if(req.body.account_id_name) query.account_id_name = req.body.account_id_name;
             if(req.body.profile_image) query.profile_image = req.body.profile_image;
             if(req.body.cover_image) query.cover_image = req.body.cover_image;
        }
        var updateInstitute = await instituteModel.findByIdAndUpdate(req.body.institution_id, query, { new:true }) ;
        res.json({
            status:true,
            message:"updated successfully!"
            // data: updateInstitute
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//update institute's specific location
const updateInstituteLocation = async (req, res)=>{
    try{
        var query = {
            image:[String]
        };
        if(req.body){
             if(req.body.country_name) query.country_name = req.body.country_name;
             if(req.body.country_code) query.country_code = req.body.country_code;
             if(req.body.state) query.state = req.body.state;
             if(req.body.city) query.city = req.body.city;
             if(req.body.street_name) query.street_name = req.body.street_name;
             if(req.body.street_number) query.street_number = req.body.street_number;
             if(req.body.building_name) query.building_name = req.body.building_name;
             if(req.body.apt) query.apt = req.body.apt;
             if(req.body.phone_number) query.phone_number = req.body.phone_number;
             if(req.body.postal_code) query.postal_code = req.body.postal_code;
             if(req.body.branch_id) query.branch_id = req.body.branch_id;
             if(req.body.branch_name) query.branch_name = req.body.branch_name;
             if(req.body.routing_number) query.routing_number = req.body.routing_number;
             if(req.body.branch_transit_number) query.branch_transit_number = req.body.branch_transit_number;
             if(req.body.open_hours) query.open_hours = req.body.open_hours;
             if(req.body.email) query.email = req.body.email;
             if(req.body.website) query.website = req.body.website;
             if(req.body.ifsc_code) query.ifsc_code = req.body.ifsc_code;
             if(req.body.micr_code) query.micr_code = req.body.micr_code;
             //to be done for images of a location
             if(req.body.image) query.image = (req.body.image);
        }

        var updateLocation = await locationModel.findByIdAndUpdate(req.body.location_id, query, { new:true }) ;
        res.json({
            status:true,
            message:" location updated successfully!"
            // data: updateLocation
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//update institute's specific currency
const updateInstituteCurrency = async (req, res)=>{
    try{
        var query = {};
        if(req.body){
             if(req.body.currency_type) query.currency_type = req.body.currency_type;
             if(req.body.full_name) query.full_name = req.body.full_name;
             if(req.body.currency_code) query.currency_code = req.body.currency_code;
             if(req.body.currency_icon) query.currency_icon = req.body.currency_icon;
             if(req.body.currency_issuing_country) query.currency_issuing_country = req.body.currency_issuing_country;
             if(req.body.currency_symbol) query.currency_symbol = req.body.currency_symbol;
        }

        var updateCurrency = await currencyModel.findByIdAndUpdate(req.body.currency_id, query, { new:true }) ;
        res.json({
            status:true,
            message:" currency updated successfully!"
            // data: updateCurrency
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//update institute's specific additional link
const updateInstituteAdditionalLink = async (req, res)=>{
    try{
        var query = {};
        if(req.body){
             if(req.body.link_name) query.link_name = req.body.link_name;
             if(req.body.link) query.link = req.body.link;
        }
        var institute = await instituteModel.findOne({_id : req.body.institution_id});
        var index = _.findIndex(institute.additional_link, function(o) { return o._id == req.body.additional_link_id; });
        institute.additional_link.splice(index, 1, query);
        var updateCurrency = await instituteModel.findByIdAndUpdate(req.body.institution_id, {$set:{"additional_link":institute.additional_link}}, { new:true }) ;
        res.json({
            status:true,
            message:" additional link updated successfully!"
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//DELETE  an Institute
const deleteInstitute = async (req, res)=>{
    try{
       
        var deletedInstitute = await instituteModel.findByIdAndUpdate(req.body.id, { delete:true },{new:true}) ;
        // console.log(deletedInstitute, 'updated------');
        res.json({
            status:true,
            message:`${deletedInstitute.institute_name} deleted successfully!`
            // data: deletedInstitute
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//delete institute's specific currency 
const deleteInstituteCurrency = async (req, res)=>{
    try{
       var updateCurrency = await currencyModel.findByIdAndUpdate(req.body.currency_id,{ $set:{"delete": true}}, {new:true});
       var institute = await instituteModel.findOne({_id : req.body.institute_id});
       var evens = _.remove(institute.all_supported_currency, function(ele) {
        return ele._id == req.body.currency_id;
      });
      var updateCurrency = await instituteModel.findByIdAndUpdate(req.body.institute_id, {$set:{"all_supported_currency":institute.all_supported_currency}}, { new:true }) ;
       res.json({
            status:true,
            message:" currency deleted successfully!"
            // data:updateCurrency
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//delete institute's specific location 
const deleteInstituteLocation = async (req, res)=>{
    try{
       var updateLocation = await locationModel.findByIdAndUpdate(req.body.location_id,{ $set:{"delete": true}}, {new:true});
       var institute = await instituteModel.findOne({_id : req.body.institute_id});
       var evens = _.remove(institute.locations, function(ele) {
        return ele._id == req.body.location_id;
      });
      var updateLocation = await instituteModel.findByIdAndUpdate(req.body.institute_id, {$set:{"locations":institute.locations}}, { new:true }) ;
       res.json({
            status:true,
            message:" location deleted successfully!"
            // data:updateLocation
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//delete institute's specific additional link 
const deleteInstituteAdditionalLink = async (req, res)=>{
    try{
        var institute = await instituteModel.findOne({_id : req.body.institute_id});
        var index = _.findIndex(institute.additional_link, function(o) { return o._id == req.body.additional_link_id; });
        institute.additional_link[index].delete = true;
        var updateCurrency = await instituteModel.findByIdAndUpdate(req.body.institute_id, {$set:{"additional_link":institute.additional_link}}, { new:true }) ;
        res.json({
            status:true,
            message:" additional link deleted successfully!"
            // data:{index,
            //     updateCurrency}
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes
const getListOfInstitute = async (req, res)=>{
    try{
       var response = [];
        var listOfInstitute = await instituteModel.find({delete: false}).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => {
            var result = {};
            element.additional_link= element.additional_link.filter(ele => ele.delete === false);
            result = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
        //  console.log(result, 'after pick--------------');  
            result.all_supported_currency = element.all_supported_currency;
            result.locations = element.locations;
            result.additional_link = element.additional_link;
            response.push(result);   
        });
        res.json({
            status:true,
            Total_Institute:listOfInstitute.length,
            data: response
        });

    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes for a specific country
const listInstitutesOfACountry = async (req, res)=>{
    try{
        var response = [];
        var listOfInstitute = await instituteModel.find({delete: false}).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => {
            var doc = {};
            element.locations= _.filter(element.locations, (ele) => { return ele.country_name.toLowerCase() == req.params.country_name.toLowerCase() });
            if(element.locations.length > 0){
                element.additional_link= element.additional_link.filter(ele => ele.delete === false);
                doc = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
            //  console.log(result, 'after pick--------------');  
                doc.all_supported_currency = element.all_supported_currency;
                doc.locations = element.locations;
                doc.additional_link = element.additional_link;
                response.push(doc); 
            }     
        }
        );
        res.json({
            status:true,
            Total_Institute:response.length,
            data: response
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes for a specific state of a country
const listInstitutesOfACountry_state = async (req, res)=>{
    try{
        var response = [];
        var listOfInstitute = await instituteModel.find({delete: false}).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => {
            var doc = {};
            element.locations= _.filter(element.locations, (ele) => { return ele.state.toLowerCase() == req.params.state.toLowerCase() });
            if(element.locations.length > 0){
                element.additional_link= element.additional_link.filter(ele => ele.delete === false);
                doc = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
            //  console.log(result, 'after pick--------------');  
                doc.all_supported_currency = element.all_supported_currency;
                doc.locations = element.locations;
                doc.additional_link = element.additional_link;
                response.push(doc); 
            }    
        }
        );
        res.json({
            status:true,
            Total_Institute:response.length,
            data: response
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes for a specific state of a country
const listInstitutesOfACountry_city = async (req, res)=>{
    try{
        var response = [];
        var listOfInstitute = await instituteModel.find({delete: false}).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => {
            var doc = {};
            element.locations= _.filter(element.locations, (ele) => { return ele.city.toLowerCase() == req.params.city.toLowerCase() });
            if(element.locations.length > 0){
                element.additional_link= element.additional_link.filter(ele => ele.delete === false);
                doc = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
            //  console.log(result, 'after pick--------------');  
                doc.all_supported_currency = element.all_supported_currency;
                doc.locations = element.locations;
                doc.additional_link = element.additional_link;
                response.push(doc); 
            }     
        }
        );
        res.json({
            status:true,
            Total_Institute:response.length,
            data: response
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes for a specific state of a country
const listInstitutesByInstituteType = async (req, res)=>{
    try{
        var response = [];
        var listOfInstitute = await instituteModel.find({ delete: false }).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => {
            var doc = {};
            if(element.institute_type.toLowerCase() == req.params.institute_type.toLowerCase()){
                element.additional_link= element.additional_link.filter(ele => ele.delete === false);
                doc = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
                //  console.log(result, 'after pick--------------');  
                doc.all_supported_currency = element.all_supported_currency;
                doc.locations = element.locations;
                doc.additional_link = element.additional_link;
                response.push(doc);      
        }     
        }
        );
        res.json({
            status:true,
            Total_Institute:response.length,
            data: response
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET LIST of  institutes for a specific state of a country
const listInstitutesByCurrencyType = async (req, res)=>{
    try{
        console.log('query--->',req.query);
        var response = [];
        var listOfInstitute = await instituteModel.find({delete: false}).populate('all_supported_currency').populate('locations') ;
        listOfInstitute.forEach(element => { 
            var doc = {};
            element.all_supported_currency= _.filter(element.all_supported_currency, (ele) => { return (ele.currency_type == req.query.currency_type && ele.currency_code == req.query.currency_code) });
            if(element.all_supported_currency.length > 0){
                element.additional_link= element.additional_link.filter(ele => ele.delete === false);
                doc = _.pick(element, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','createdAt','updatedAt','swift_code','color_code','__v']);
                //  console.log(result, 'after pick--------------');  
                doc.all_supported_currency = element.all_supported_currency;
                doc.locations = element.locations;
                doc.additional_link = element.additional_link;
                response.push(doc);  
            }     
        }
        );
        res.json({
            status:true,
            Total_Institute:response.length,
            data: response
        });
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

//GET a single  institutes
const listAInstitute = async (req, res)=>{
    try{
        var listOfInstitute = await instituteModel.findOne({_id: req.params.id,delete: false}).populate('locations').populate('all_supported_currency');
        if(listOfInstitute.locations.length > 0){ listOfInstitute.no_of_branches = listOfInstitute.locations.length; }
        if(listOfInstitute.all_supported_currency.length > 0){ listOfInstitute.no_of_currencies = listOfInstitute.all_supported_currency.length; }
        
        if(listOfInstitute){
            var result = _.pick(listOfInstitute, ['_id', 'delete','institute_name','short_name','institute_type','profile_image','cover_image','country_name','country_code','Website','phone_number','email','','bank_id_name','bank_id','branch_id_name','account_id_name','additional_link','no_of_branches','locations','no_of_currencies','all_supported_currency','swift_code','color_code','createdAt','updatedAt','__v']);
            res.json({
                status:true,
                data: result
            });
        }else{
            throw new Error("given institute doesn't exist!");
        }
       
    }catch(error){
        res.json({
            status:false,
            error: error.message
        });
    }
}

module.exports = {
    addInstitute,
    addInstituteLocation,
    addInstituteCurrency,
    addInstituteAdditionalLink,
    updateInstitute,
    updateInstituteLocation,
    updateInstituteCurrency,
    updateInstituteAdditionalLink,
    deleteInstitute,
    deleteInstituteCurrency,
    deleteInstituteLocation,
    deleteInstituteAdditionalLink,
    getListOfInstitute,
    listInstitutesOfACountry,
    listInstitutesOfACountry_state,
    listInstitutesOfACountry_city,
    listInstitutesByInstituteType,
    listInstitutesByCurrencyType,
    listAInstitute 
}