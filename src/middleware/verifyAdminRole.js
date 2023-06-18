const AuthorizationError = require('../exceptions/AuthorizationError');

const verifyAdminRole = async (request, h) => {
  const { role } = request.auth.credentials;

  if (role !== 'admin') {
    throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  return h.continue;
};

module.exports = verifyAdminRole;
