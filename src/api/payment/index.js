const PaymentHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'payment',
  version: '1.0.0',
  register: async (server, {
    usersService, purchaseService, snap, validator 
  }) => {
    const paymentHandler = new PaymentHandler(usersService, purchaseService, snap, validator);
    server.route(routes(paymentHandler));
  },
};