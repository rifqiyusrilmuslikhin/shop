class OrderHandler {
  constructor(ordersService, productsService, usersService, validator) {
    this._ordersService = ordersService;
    this._productsService = productsService;
    this._usersService = usersService;
    this._validator = validator;
    
    this.postOrderHandler = this.postOrderHandler.bind(this);
    this.getAllItemHandler = this.getAllItemHandler.bind(this);
    this.getUserItemHandler = this.getUserItemHandler.bind(this);
  }
    
  // eslint-disable-next-line consistent-return
  async postOrderHandler(request, h) {
    try {
      this._validator.validateOrderPayload(request.payload);
      const { items } = request.payload;
      const { id: credentialId } = request.auth.credentials;
    
      const orderData = { items };
    
      const orderId = await this._ordersService.addOrder(orderData, credentialId);
    
      const response = h.response({
        status: 'success',
        message: 'Order berhasil ditambahkan',
        data: {
          orderId
        },
      });
      response.code(201);
      return response;
    } catch (error){
      console.log(error);
    }
  }

  async getAllItemHandler() {
    const orders = await this._ordersService.getAllItem();
    return {
      status: 'success',
      data: {
        orders
      },
    };
  }

  async getUserItemHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const orders = await this._ordersService.getUserItem(credentialId);
    return {
      status: 'success',
      data: {
        orders
      },
    };
  }
}
    
module.exports = OrderHandler;