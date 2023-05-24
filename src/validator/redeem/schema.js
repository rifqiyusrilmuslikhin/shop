const Joi = require('joi');
 
const RedeemPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  pointsToRedeem: Joi.number().integer().min(1).required(),
});
 
module.exports = { RedeemPayloadSchema };