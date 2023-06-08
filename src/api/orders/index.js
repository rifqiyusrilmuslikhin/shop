const OrderHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'orders',
  version: '1.0.0',
  register: async (server, {
    ordersService, productsService, usersService, validator 
  }) => {
    const orderHandler = new OrderHandler(ordersService, productsService, usersService, validator);
    server.route(routes(orderHandler));
  },
};