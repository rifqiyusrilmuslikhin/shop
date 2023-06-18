const ShippingHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'shipping',
  version: '1.0.0',
  register: async (server, { shippingService, validator }) => {
    const shippingHandler = new ShippingHandler(shippingService, validator);
    server.route(routes(shippingHandler));
  },
};