class ProductHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      this.postProductHandler = this.postProductHandler.bind(this);
      this.getAllProductHandler = this.getAllProductHandler.bind(this);
      this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
      this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    }
  
    async postProductHandler(request, h) {
      this._validator.validateProductPayload(request.payload);
      const { productName, price } = request.payload;
      const { id: credentialId } = request.auth.credentials;
  
      const productId = await this._service.addProduct({
        productName, price, owner: credentialId,
      });
  
      const response = h.response({
        status: 'success',
        message: 'Produk berhasil ditambahkan',
        data: {
          productId,
        },
      });
      response.code(201);
      return response;
    }

    async getAllProductHandler() {
        const products = await this._service.getAllProduct();
        return {
          status: 'success',
          data: {
            products,
          },
        };
      }

      async putProductByIdHandler(request) {
        this._validator.validateProductPayload(request.payload);
        const { productName, price } = request.payload;
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
    
        await this._service.verifyProductOwner(id, credentialId);
    
        await this._service.editProductById(id, { productName, price });
    
        return {
          status: 'success',
          message: 'Produk berhasil diperbarui',
        };
      }

      async deleteProductByIdHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
    
        await this._service.verifyProductOwner(id, credentialId);
        await this._service.deleteProductById(id);
    
        return {
          status: 'success',
          message: 'Produk berhasil dihapus',
        };
      }
  }
  
  module.exports = ProductHandler;