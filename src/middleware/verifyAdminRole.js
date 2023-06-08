const Boom = require('@hapi/boom');

const verifyAdminRole = async (request, h) => {
  const { role } = request.auth.credentials;

  if (role !== 'admin') {
    throw Boom.unauthorized('Anda tidak berhak mengakses resource ini');
  }

  return h.continue;
};

module.exports = verifyAdminRole;
