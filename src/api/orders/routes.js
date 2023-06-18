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
    path: '/api/orders/status/pending',
    handler: handler.getPendingOrderHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/orders/status/success',
    handler: handler.getSuccessOrderHandler,
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
  {
    method: 'PUT',
    path: '/api/orders/status/{id}',
    handler: handler.putOrderStatusByIdHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
];
    
module.exports = routes;