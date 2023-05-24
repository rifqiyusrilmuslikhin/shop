const InvariantError = require('../../exceptions/InvariantError');
const { AdminPayloadSchema } = require('./schema');
 
const AdminValidator = {
  validateAdminPayload: (payload) => {
    const validationResult = AdminPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AdminValidator;