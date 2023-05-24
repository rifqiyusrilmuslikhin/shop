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
    // {
    //     method: 'GET',
    //     path: '/api/roles/admin/{id}',
    //     handler: handler.getAdminRoleHandler,
    // },
  ];
   
  module.exports = routes;