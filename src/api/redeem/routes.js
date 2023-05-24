const routes = (handler) => [
    {
      method: 'POST',
      path: '/api/redeem',
      handler: handler.postRedeemHandler
    },
  ];
  
  module.exports = routes;