const Joi = require('joi');
 
const PurchasePayloadSchema = Joi.object({
  // userId: Joi.number().integer().positive().required(),
  // purchases: Joi.array()
  //   .items(
  //     Joi.object({
  //       productId: Joi.number().integer().positive().required(),
  //       quantity: Joi.number().integer().min(1).required(),
  //       price: Joi.number().integer().min(0).required(),
  //     })
  //   )
  //   .min(1)
  //   .required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});
 
module.exports = { PurchasePayloadSchema };