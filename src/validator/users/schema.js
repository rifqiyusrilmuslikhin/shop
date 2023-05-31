const Joi = require('joi');
 
const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email harus berupa teks',
      'string.empty': 'Email tidak boleh kosong',
      'string.email': 'Email harus memiliki format yang valid',
      'any.required': 'Email harus diisi',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      'string.base': 'Nomor telepon harus berupa teks',
      'string.empty': 'Nomor telepon tidak boleh kosong',
      'string.pattern.base': 'Nomor telepon harus berupa angka',
      'string.min': 'Nomor telepon minimal 10 digit',
      'string.max': 'Nomor telepon maksimal 15 digit',
      'any.required': 'Nomor telepon harus diisi',
    }),
  address: Joi.string().required(),
  points: Joi.number().default(0)
});

module.exports = { UserPayloadSchema };