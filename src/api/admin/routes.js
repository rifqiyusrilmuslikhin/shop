const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/admin',
    handler: handler.postAdminHandler,
  },
  {
    method: 'GET',
    path: '/api/admin',
    handler: handler.getAllAdminHandler,
  },
];
   
module.exports = routes;