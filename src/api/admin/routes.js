const verifyAdminRole = require('../../middleware/verifyAdminRole');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/admin',
    handler: handler.postAdminHandler,
  },
  {
    method: 'GET',
    path: '/api/admin',
    handler: handler.getAllAdminHandler,
  },
  {
    method: 'GET',
    path: '/api/admin/credentials',
    handler: handler.getAdminByCredentialHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'PUT',
    path: '/api/admin/{id}',
    handler: handler.putAdminHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
];
   
module.exports = routes;