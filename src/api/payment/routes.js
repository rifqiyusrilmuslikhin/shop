const routes = (handler) => [
  {
    method: 'GET',
    path: '/{purchaseId}/generate-snap-token',
    handler: handler.generateSnapToken,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/midtrans/status/{transactionId}',
    handler: handler.getStatusHandler,
  },   
];
   
module.exports = routes;