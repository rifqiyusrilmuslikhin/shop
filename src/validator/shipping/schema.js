const Joi = require('joi');
 
const OriginPayloadSchema = Joi.object({
  province: Joi.string().required(),
  city: Joi.string().required()
});

module.exports = { OriginPayloadSchema };