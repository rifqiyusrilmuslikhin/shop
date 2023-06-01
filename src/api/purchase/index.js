const PurchaseHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'purchase',
  version: '1.0.0',
  register: async (server, {
    purchaseService, productsService, usersService, validator 
  }) => {
    const purchaseHandler = new PurchaseHandler(purchaseService, productsService, usersService, validator);
    server.route(routes(purchaseHandler));
  },
};