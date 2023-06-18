const Joi = require('joi');

const ItemSchema = Joi.object({
  productId: Joi.string().required(),
  price: Joi.number().integer().min(0),
  quantity: Joi.number().integer().min(1).required(),
  name: Joi.string()
});
  
const OrderPayloadSchema = Joi.object({
  items: Joi.array().items(ItemSchema).min(1).required(),
  totalPrice: Joi.number().integer(),
  payment: Joi.number().integer(),
  remaining_payment: Joi.number().integer(),
  points: Joi.number().default(0),
  status: Joi.string().default('Pending'),
  date: Joi.date().iso()
});

const UpdateStatusPayloadSchema = Joi.object({
  status: Joi.string().valid('pending', 'failed', 'success').required()
});

module.exports = { OrderPayloadSchema, UpdateStatusPayloadSchema };
