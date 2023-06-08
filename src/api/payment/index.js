const PaymentHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'payment',
  version: '1.0.0',
  register: async (server, {
    usersService, ordersService, snap, validator 
  }) => {
    const paymentHandler = new PaymentHandler(usersService, ordersService, snap, validator);
    server.route(routes(paymentHandler));
  },
};