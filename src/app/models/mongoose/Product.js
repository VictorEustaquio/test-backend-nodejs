const mongoose = require('mongoose');
const Schema = mongoose.Schema;

    const schema = new Schema({
        title: {
            type: String,
            require:false,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: String,
            required: false
        },
        category: {
            type: Schema.Types.ObjectId, 
            ref: 'Categories'
        }, 
        creadted_by: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        updated_by:{
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }
    },)
    schema.set('timestamps', true)

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            // remove props on object serialization
            delete ret._id;
        }
    });


    const productModel = mongoose.model('Products', schema, 'Products');
    
    
    module.exports = productModel