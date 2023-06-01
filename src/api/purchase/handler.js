/* eslint-disable camelcase */
class PurchaseHandler {
  constructor(purchaseService, productsService, usersService, validator) {
    this._purchaseService = purchaseService;
    this._productsService = productsService;
    this._usersService = usersService;
    this._validator = validator;
  
    this.postPurchaseHandler = this.postPurchaseHandler.bind(this);
    // this.generateSnapToken = this.generateSnapToken.bind(this);
  }
  
  async postPurchaseHandler(request, h) {
    this._validator.validatePurchasePayload(request.payload);
    const {
      productId, quantity, paymentRemaining, points
    } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const product = await this._productsService.getProductPrice(productId);
    const { id: product_id, price } = product;

    const productPrice = price * quantity;

    if (productPrice > 100000) {
      const purchasePoints = Math.floor(productPrice / 100000);
      console.log(purchasePoints);
      await this._purchaseService.updatePoints(credentialId, purchasePoints);
    }

    const transactionAmount = points * 20000;

    let status;

    if (points) {      
      await this._purchaseService.updatePointsAfterRedeem(credentialId, points);
      if (paymentRemaining === 0) {
        status = 'Lunas';
      }
    }
    
    const purchaseId = await this._purchaseService.addPurchaseDetails({
      productId: product_id, userId: credentialId, quantity, price: productPrice, payment: transactionAmount, paymentRemaining, points, status, 
    });
    
    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: {
        purchaseId,
      },
    });
    response.code(201);
    return response;
  }

  //     async generateSnapToken(request, h) {
  //     const transactionDetails = {
  //       transaction_details: {
  //         order_id: 'oreddesdr31',
  //         gross_amount: 10000,
  //       },
  //       credit_card: {
  //         secure: true,
  //       },
  //       customer_details: {
  //         first_name: 'John',
  //         last_name: 'Doe',
  //         email: 'johndoe@example.com',
  //         phone: '081234567890',
  //       },
  //     };

  //     const snapToken = await snap.createTransactionToken(transactionDetails);

  //     return { snapToken };
  // };
}
  
module.exports = PurchaseHandler;