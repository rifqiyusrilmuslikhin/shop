const routes = (handler) => [
    {
      method: 'POST',
      path: '/api/purchase',
      handler: handler.postPurchaseHandler,
      options: {
        auth: 'shop_jwt',
      },
    },
  ];
  
  module.exports = routes;