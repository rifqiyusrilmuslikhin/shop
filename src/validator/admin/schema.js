const Joi = require('joi');
 
const AdminPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string()
});

module.exports = { AdminPayloadSchema };