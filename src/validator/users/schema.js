const Joi = require('joi');
 
const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  points: Joi.number().default(0)
});

module.exports = { UserPayloadSchema };