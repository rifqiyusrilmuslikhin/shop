class PurchaseHandler {
    constructor(purchaseService, productsService, usersService, validator) {
      this._purchaseService = purchaseService;
      this._productsService = productsService;
      this._usersService = usersService;
      this._validator = validator;
  
      this.postPurchaseHandler = this.postPurchaseHandler.bind(this);
    }
  
    async postPurchaseHandler(request, h) {
        this._validator.validatePurchasePayload(request.payload);
        const { productId, quantity, paymentRemaining, points, status } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const product = await this._productsService.getProductPrice(productId);
        const { id: product_id, price } = product;

        // const userPoints = await this._usersService.getUserById(credentialId);
        // const { points: user_points } = userPoints;
        // console.log(user_points);

        const productPrice = price*quantity;

        if (productPrice > 100000) {
          
          let totalPoints = 0;
          const purchasePoints = Math.floor(productPrice / 50000);
          totalPoints += purchasePoints;
          await this._purchaseService.updatePoints(credentialId, purchasePoints);
        }

        let transactionAmount = points*20000;

        if (points) {      
          await this._purchaseService.updatePointsAfterRedeem(credentialId, points);
          if (paymentRemaining === 0) {
            status = "Lunas";
          }
        }
    
        const purchaseId = await this._purchaseService.addPurchaseDetails({
          productId: product_id, userId: credentialId, quantity, price: productPrice, payment: transactionAmount, paymentRemaining, points 
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