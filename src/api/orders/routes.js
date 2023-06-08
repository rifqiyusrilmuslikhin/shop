const verifyAdminRole = require('../../middleware/verifyAdminRole');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/orders',
    handler: handler.postOrderHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/orders',
    handler: handler.getAllItemHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/orders/users',
    handler: handler.getUserItemHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
];
    
module.exports = routes;