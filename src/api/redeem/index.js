const RedeemHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'redeem',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const redeemHandler = new RedeemHandler(service, validator);
    server.route(routes(redeemHandler));
  },
};