const ShippingHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'shipping',
  version: '1.0.0',
  register: async (server, { shippingService }) => {
    const shippingHandler = new ShippingHandler(shippingService);
    server.route(routes(shippingHandler));
  },
};