const InvariantError = require('../../exceptions/InvariantError');
const { RedeemPayloadSchema } = require('./schema');

const RedeemValidator = {
  validateRedeemPayload: (payload) => {
    const validationResult = RedeemPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = RedeemValidator;
