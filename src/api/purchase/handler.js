/* eslint-disable camelcase */
class PurchaseHandler {
  constructor(purchaseService, productsService, usersService, validator) {
    this._purchaseService = purchaseService;
    this._productsService = productsService;
    this._usersService = usersService;
    this._validator = validator;
  
    this.postPurchaseHandler = this.postPurchaseHandler.bind(this);
    this.getAllPurchaseHandler = this.getAllPurchaseHandler.bind(this);
    this.getPurchaseByUserHandler = this.getPurchaseByUserHandler.bind(this);
    this.getPurchaseByIdHandler = this.getPurchaseByIdHandler.bind(this);
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
      await this._purchaseService.updatePoints(credentialId, purchasePoints);
    }

    const transactionAmount = points * 20000;

    if (points) {      
      await this._purchaseService.updatePointsAfterRedeem(credentialId, points);
    }
    
    const purchaseId = await this._purchaseService.addPurchaseDetails({
      productId: product_id, userId: credentialId, quantity, price: productPrice, payment: transactionAmount, paymentRemaining, points, 
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

  async getAllPurchaseHandler() {
    const purchases = await this._purchaseService.getAllPurchase();
    return {
      status: 'success',
      data: {
        purchases,
      },
    };
  }

  async getPurchaseByUserHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const purchase = await this._purchaseService.getPurchaseByUser(id, credentialId);

    return {
      status: 'success',
      data: {
        purchase
      },
    };
  }

  async getPurchaseByIdHandler(request) {
    const { id } = request.params;

    const purchase = await this._purchaseService.getPurchaseById(id);

    return {
      status: 'success',
      data: {
        purchase
      },
    };
  }
}
  
module.exports = PurchaseHandler;