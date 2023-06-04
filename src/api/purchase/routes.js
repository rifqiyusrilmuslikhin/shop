const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/purchase',
    handler: handler.postPurchaseHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/purchase',
    handler: handler.getAllPurchaseHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/purchase/{id}',
    handler: handler.getPurchaseByUserHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/admin/purchase/{id}',
    handler: handler.getPurchaseByIdHandler,
  },
];
  
module.exports = routes;