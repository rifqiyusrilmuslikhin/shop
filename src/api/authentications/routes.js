const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/authentications/admin',
    handler: handler.postAdminAuthenticationHandler,
  },
  {
    method: 'POST',
    path: '/api/authentications/users',
    handler: handler.postUserAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/api/authentications',
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/api/authentications',
    handler: handler.deleteAuthenticationHandler,
  },
];
  
module.exports = routes;