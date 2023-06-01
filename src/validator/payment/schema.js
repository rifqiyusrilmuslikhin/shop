const Joi = require('joi');

const GenerateSnapToken = {
  query: Joi.object({
    order_id: Joi.string().required(),
    gross_amount: Joi.number().required(),
  }),
};

module.exports = {
  GenerateSnapToken,
};
