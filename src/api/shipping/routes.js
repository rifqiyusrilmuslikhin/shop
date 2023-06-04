const routes = (handler) => [
  {
    method: 'GET',
    path: '/api/provinces',
    handler: handler.getProvincesHandler,
    // options: {
    //   auth: 'shop_jwt',
    // },
  },
  {
    method: 'GET',
    path: '/api/cities',
    handler: handler.getCitiesHandler,
    // options: {
    //   auth: 'shop_jwt',
    // },
  },
  {
    method: 'POST',
    path: '/api/shipping-cost',
    handler: handler.postShippingCostHandler,
    // options: {
    //   auth: 'shop_jwt',
    // },
  },
];
      
module.exports = routes;