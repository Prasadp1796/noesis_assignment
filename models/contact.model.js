const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

// mongoose.set('useCreateIndex', true);

const contactSchema = mongoose.Schema({
    _id: Number,
    "firstName":  String,
    "middleName": String,
    "lastName": String,
    "email": {type: String, unique: "Contact With This Email Already Exist" , sparse: true},
    "contact": {type: String, unique: "Contact With This Number Already Exist" , sparse: true},
    "telephone": {type: String, unique: "Telephone With This Number Already Exist" , sparse: true},
    "contactPic": String,
    "createdAt": Date,
    "updatedAt": Date,
    "note": String,
    "isDeleted": {type:Boolean, default: false}
}, { _id: false });

//Validate Data
contactSchema.plugin(validator);

//Add Auto Increament To Event ID
contactSchema.plugin(AutoIncrement, {
    modelName: 'contacts',
    type: Number,
    unique: true,
    fieldName: '_id'
});


module.exports = mongoose.model('contacts', contactSchema);