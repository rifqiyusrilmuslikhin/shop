const InvariantError = require('../../exceptions/InvariantError');
const { GenerateSnapToken } = require('./schema');

const SnapTokenValidator = {
  validatePurchasePayload: (payload) => {
    const validationResult = GenerateSnapToken.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SnapTokenValidator;
