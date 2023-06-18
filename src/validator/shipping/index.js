const InvariantError = require('../../exceptions/InvariantError');
const { OriginPayloadSchema } = require('./schema');
 
const OriginValidator = {
  validateOriginPayload: (payload) => {
    const validationResult = OriginPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OriginValidator;