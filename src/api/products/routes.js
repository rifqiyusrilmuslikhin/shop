const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/products',
    handler: handler.postProductHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/products',
    handler: handler.getAllProductHandler,
  },
  {
    method: 'PUT',
    path: '/api/products/{id}',
    handler: handler.putProductByIdHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/api/products/{id}',
    handler: handler.deleteProductByIdHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'POST',
    path: '/api/products/{id}/img',
    handler: handler.postUploadImageHandler,
    options: {
      auth: 'shop_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 512000,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../uploads/file'),
      },
    },
  },
];
  
module.exports = routes;