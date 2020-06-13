const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

// mongoose.set('useCreateIndex', true);

const viewsSchema = mongoose.Schema({
    _id: Number,
    "count": Number,
    "date": Date,
    "contactId": Number
}, { _id: false });

//Create Index
viewsSchema.index({date: 1, contactId: 1}, {unique: true});

//Validate Data
viewsSchema.plugin(validator);

//Add Auto Increament To Event ID
viewsSchema.plugin(AutoIncrement, {
    modelName: 'views',
    type: Number,
    unique: true,
    fieldName: '_id'
});


module.exports = mongoose.model('views', viewsSchema);