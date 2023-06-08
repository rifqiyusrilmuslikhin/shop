const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema, ForgotPasswordSchema, ResetPasswordSchema } = require('./schema');
 
const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateForgotPasswordPayload: (payload) => {
    const validationResult = ForgotPasswordSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateResetPasswordPayload: (payload) => {
    const validationResult = ResetPasswordSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;