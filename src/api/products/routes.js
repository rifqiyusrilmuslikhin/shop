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
  ];
  
  module.exports = routes;