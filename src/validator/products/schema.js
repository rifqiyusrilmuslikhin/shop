const Joi = require('joi');
 
const ProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().positive().required(),
});
 
module.exports = { ProductPayloadSchema };