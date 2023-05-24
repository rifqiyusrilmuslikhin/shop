class PurchaseHandler {
    constructor(service, validator) {
      this._service = service;
      // this._productsService = productsService;
      // this._usersService = usersService;
      this._validator = validator;
  
      this.postPurchaseHandler = this.postPurchaseHandler.bind(this);
    }
  
    async postPurchaseHandler(request, h) {
      // this._validator.validatePurchasePayload(request.payload);
      //   const { userId, purchases } = request.payload;
      
      //   let totalPurchase = 0;
      //   let totalPoints = 0;
      
      //   for (const purchase of purchases) {
      //     const { productId, quantity, price } = purchase;
      
      //     totalPurchase += quantity * price;
      
      //     const purchasePoints = Math.floor(totalPurchase / 50000);
      //     totalPoints += purchasePoints;
      
      //     await this._service.savePurchaseDetails(userId, productId, quantity, price);
      //   }
      
      //   const transactionId = await this._service.saveTransactionDetails(userId, totalPurchase, totalPoints);
      //   await this._service.updatePoints(userId, totalPoints);
      
      //   const response = h.response({
      //     status: 'success',
      //     message: 'Pembelian berhasil ditambahkan',
      //     data: {
      //       transactionId,
      //       totalPurchase,
      //       totalPoints,
      //     },
      //   });
      //   response.code(201);
      //   return response;
        this._validator.validatePurchasePayload(request.payload);
        const { quantity, productId } = request.payload;
        const { id: credentialId } = request.auth.credentials;
    
        const purchaseId = await this._service.addPurchaseDetails({
          userId: credentialId, productId, quantity,
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
  }
  
  module.exports = PurchaseHandler;