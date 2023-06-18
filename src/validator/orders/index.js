const InvariantError = require('../../exceptions/InvariantError');
const { OrderPayloadSchema, UpdateStatusPayloadSchema } = require('./schema');

const OrderValidator = {
  validateOrderPayload: (payload) => {
    const validationResult = OrderPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateStatusPayload: (payload) => {
    const validationResult = UpdateStatusPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OrderValidator;
