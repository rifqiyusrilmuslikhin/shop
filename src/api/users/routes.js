const verifyAdminRole = require('../../middleware/verifyAdminRole');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/api/users',
    handler: handler.getUsersHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/users/credentials',
    handler: handler.getUserByCredentialHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/activate',
    handler: handler.activateAccountHandler,
  },
  {
    method: 'POST',
    path: '/api/users/forgot-password',
    handler: handler.forgotPasswordHandler,
  },
  {
    method: 'POST',
    path: '/api/users/reset-password',
    handler: handler.resetPasswordHandler,
  },
];
   
module.exports = routes;