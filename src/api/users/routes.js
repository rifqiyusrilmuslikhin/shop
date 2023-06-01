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
  },
];
   
module.exports = routes;