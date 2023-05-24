class RedeemHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      this.postRedeemHandler = this.postRedeemHandler.bind(this);
    }
  
    async postRedeemHandler(request, h) {
        this._validator.validateRedeemPayload(request.payload);
        const { userId, pointsToRedeem } = request.payload;
      
        const userPoints = await this._service.getUserPoints(userId);
      
        if (userPoints >= pointsToRedeem) {
          const transactionAmount = pointsToRedeem * 20000;
      
          const transactionId = await this._service.saveTransactionDetails(userId, transactionAmount);
          await this._service.updatePoints(userId, pointsToRedeem);
      
        const response = h.response({
            status: 'success',
            message: 'Berhasil Redeem Point',
            data: {
                transactionId,
                transactionAmount,
            },
          });
          response.code(201);
          return response;
      }
  }
}
  module.exports = RedeemHandler;