const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/purchase',
    handler: handler.postPurchaseHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  // {
  //   method: 'POST',
  //   path: '/transaction-token',
  //   handler: handler.getTransactionTokenHandler,
  // },
];
  
module.exports = routes;