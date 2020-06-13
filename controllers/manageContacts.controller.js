const contactSchema = require('../models/contact.model');
const viewsSchema = require('../models/viewsCount.model');
const filesUploader = require('../lib/fileUploader');
const e = require('express');

class ContactController{
    //Method To Upload Contact Image
    async uploadProductImages(req, res) {
        filesUploader(req, res, async function(err) {
            if (err)
                res.sendStatus(500);
            else {
                console.log(req.file)
                
                res.send(req.file.filename);
            }
        });
    }

    //Method To Create Contact
    async createContact(req, res){
        try {
            let newContact = req.body;
            newContact.createdAt = Date.now();
            newContact = await new contactSchema(newContact).save();
            res.sendStatus(201);
        } catch (err) {
            if (err.name == 'ValidationError') {
                var errorMessages = err.message.replace("contacts validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (var i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                return res.status(200).send({ message: errorMessages, error: true });
            }
            res.sendStatus(500);
        }
    }

    //Method To Get All Contacts List
    async getAllContacts(req, res){
        try{
            let contactsList = await contactSchema.find();
            res.send(contactsList);
        }catch(err){
            res.sendStatus(500);
        }
    }

    //Method To Update Contact
    async updateContactDetails(req, res){
        try{
            const contact = await contactSchema.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    runValidators: true,
                    context: 'query'
                }
            );
            if (!contact) {
                res.sendStatus(404);
            }
            res.sendStatus(201);

        }catch(err){
            if (err.name == 'ValidationError') {
                var errorMessages = err.message.replace("Validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (var i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                return res.status(200).send({ message: errorMessages });
            } else {
                res.sendStatus(500);
            }
        }
    }

    //Method To Delete Contact
    async deleteContact (req, res){
        try {
            const contact = await contactSchema.findByIdAndRemove(req.params.id);
            if (!contact) {
                res.sendStatus(404);
            }
            res.sendStatus(200);
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
               return  res.sendStatus(404);
            }
            res.sendStatus(500);
        }
    }

    //Method To Disabled Contact
    async changeContactStatus(req, res){
        try{
            const contact = await contactSchema.findByIdAndUpdate(
                req.params.id,
                {isDisabled: req.params.status}, {
                    runValidators: true,
                    context: 'query'
                }
            );

            if (!contact) {
                res.sendStatus(404);
            }
            res.sendStatus(200);
        }catch(err){
            res.sendStatus(500);
        }
    }

 

    //Method To Create Or Update Views Count
    async addOrUpdateViewsCount(req, res){
        try{
            let date = new Date(), contactId = parseInt(req.params.contactId);
            let contact = await viewsSchema.findOne({date:  {$gte: date.setHours(0,0,0,0) , $lte: date.setHours(23, 59,59,0)}, contactId: contactId});
            if(contact){    
                await viewsSchema.findOneAndUpdate({date:  {$gte: date.setHours(0,0,0,0) , $lte: date.setHours(23, 59,59,0)}, contactId: contactId}, {$inc: {'count': 1}});
                res.sendStatus(201);
            }else{
                await new viewsSchema({date: date, contactId: contactId, count: 1}).save();  
                res.sendStatus(201);
            }
        }catch(err){
            res.sendStatus(500);
        }
    }


    //Method To Get Contact Details
    async getContactDetails(req, res){
        try{
            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 29, 29, 0);
            var startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (today.getDay() == 0 ? -6 : 1) - today.getDay(), -18, -30);
            startDay.setDate(startDay.getDate() - 1);
            let contactDetails = await contactSchema.aggregate([
                {$match: {_id: parseInt(req.params.contactId)}},
                {
                    $lookup:{
                        from: "views",
                        localField: "_id",
                        foreignField: "contactId",
                        as: "views"
                    }
                },
                {$unwind: "$views"},
                {$match: {"views.date": {$lte: today, $gte: startDay}}},
                {
                  $group: {
                    _id: "views",
                      date: {$push:  {"$dateToString": { "format": "%Y-%m-%d", "date": "$views.date"} }},
                      count: {$push: "$views.count"},
                      firstName: {$first: "$firstName"},
                      middleName: {$first: "$middleName"},
                      lastName: {$first: "$lastName"},
                      email: {$first: "$email"},
                      contact: {$first: "$contact"},
                      telephone: {$first: "$telephone"},
                      note: {$first: "$note"},
                      
                 }
                }
            ])
            res.send(contactDetails);
        }catch(err){
            console.log(err)
            res.sendStatus(500);
        }
    }
}

module.exports = new ContactController();