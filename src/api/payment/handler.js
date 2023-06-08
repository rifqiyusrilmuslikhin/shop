const axios = require('axios');

class PaymentHandler {
  constructor(usersService, ordersService, snap, validator) {
    this._usersService = usersService;
    this._ordersService = ordersService;
    this._snap = snap;
    this._validator = validator;
 
    this.generateSnapToken = this.generateSnapToken.bind(this);
    this.getStatusHandler = this.getStatusHandler.bind(this);
  }

  async generateSnapToken(request) {
    const { orderId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const user = await this._usersService.getUserById(credentialId);

    const order = await this._ordersService.getDetailOrder(orderId);

    const transactionDetails = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.remaining_payment,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.username,
        last_name: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    };

    const snapToken = await this._snap.createTransactionToken(transactionDetails);

    return { snapToken };
  }

  // eslint-disable-next-line class-methods-use-this
  async getStatusHandler(request) {
    const { transactionId } = request.params;
  
    const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${transactionId}/status`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
      },
    });
 
    const paymentStatus = response.data;

    return paymentStatus;
  }
}

module.exports = PaymentHandler;