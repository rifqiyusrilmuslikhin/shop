const Joi = require('joi');
 
const PurchasePayloadSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().integer(),
  payment: Joi.number().integer(),
  remainingPayment: Joi.number().integer(),
  status: Joi.string().default('Belum Lunas'),
  points: Joi.number().default(0)
});

const transactionTokenSchema = Joi.object({
  orderId: Joi.string().required(),
  grossAmount: Joi.number().required(),
});
 
module.exports = { PurchasePayloadSchema, transactionTokenSchema };