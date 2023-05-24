const Joi = require('joi');
 
const AdminPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { AdminPayloadSchema };