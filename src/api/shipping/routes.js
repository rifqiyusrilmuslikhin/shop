const verifyAdminRole = require('../../middleware/verifyAdminRole');

const routes = (handler) => [
  {
    method: 'GET',
    path: '/api/provinces',
    handler: handler.getProvincesHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/cities',
    handler: handler.getCitiesHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/cities/{provinceId}',
    handler: handler.getCitiesByProvinceIdHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'POST',
    path: '/api/shipping-cost',
    handler: handler.postShippingCostHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'POST',
    path: '/api/services',
    handler: handler.postShippingValue,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'POST',
    path: '/api/origin',
    handler: handler.postOriginHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'PUT',
    path: '/api/origin/{id}',
    handler: handler.putOriginHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/origin',
    handler: handler.getOriginHandler,
    options: {
      auth: 'shop_jwt',
      pre: [
        { method: verifyAdminRole }
      ]
    },
  },
];
      
module.exports = routes;