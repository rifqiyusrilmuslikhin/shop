const InvariantError = require('../../exceptions/InvariantError');
const { PurchasePayloadSchema } = require('./schema');

const PurchaseValidator = {
  validatePurchasePayload: (payload) => {
    const validationResult = PurchasePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PurchaseValidator;
