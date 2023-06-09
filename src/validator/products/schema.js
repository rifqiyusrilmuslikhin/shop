const Joi = require('joi');
 
const ProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  discount: Joi.number().default(0),
  discountPrice: Joi.number().positive(),
  stock: Joi.number().positive()
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();
 
module.exports = { ProductPayloadSchema, ImageHeadersSchema };