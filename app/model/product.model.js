const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchemavalidation = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    price: Joi.string()
    .min(3)
    .max(30)
    .required(),
    description: Joi.string().min(3).max(100).required(),
    stock: Joi.string().min(0).required(),
    sizes: Joi.array().items(
        Joi.string().valid('S', 'M', 'L', 'XL', 'XXL')
    ),
    category: Joi.string().required(),
    isActive: Joi.boolean()
})
    

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        unique: true
    },
    price: {
        type: String,
        required: [true, 'Price is required!']
    },
    description: {
        type: String,
        required: [true, 'Description is required!']
    },
    image: {
        type: String,
       default: 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
     },
     stock: {
        type: String,
        required: [true, 'Stock is required!']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [String], 
        enum: ['S', 'M', 'L', 'XL', 'XXL'], 
        
    },
    isActive: {
        type: Boolean,
        default: true
    }

})

const productModel = mongoose.model('product', productSchema);

module.exports = {productModel,productSchemavalidation};