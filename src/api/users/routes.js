const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/api/users',
    handler: handler.getAllUserHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'shop_jwt',
    },
  },
];
   
module.exports = routes;