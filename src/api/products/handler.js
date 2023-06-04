class ProductHandler {
  constructor(productsService, storageService, validator) {
    this._productsService = productsService;
    this._storageService = storageService;
    this._validator = validator;
  
    this.postProductHandler = this.postProductHandler.bind(this);
    this.getAllProductHandler = this.getAllProductHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }
  
  async postProductHandler(request, h) {
    this._validator.validateProductPayload(request.payload);
    const { productName, description, price } = request.payload;
    const { id: credentialId } = request.auth.credentials;
  
    const productId = await this._productsService.addProduct({
      productName, description, price, owner: credentialId,
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
    const products = await this._productsService.getAllProduct();
    return {
      status: 'success',
      data: {
        products,
      },
    };
  }

  async getProductByIdHandler(request) {
    const { id } = request.params;

    const product = await this._productsService.getProductById(id);

    return {
      status: 'success',
      data: {
        product,
      },
    };
  }

  async putProductByIdHandler(request) {
    this._validator.validateProductPayload(request.payload);
    const { productName, price } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    
    await this._productsService.verifyProductOwner(id, credentialId);
    
    await this._productsService.editProductById(id, { productName, price });
    
    return {
      status: 'success',
      message: 'Produk berhasil diperbarui',
    };
  }

  async deleteProductByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    
    await this._productsService.verifyProductOwner(id, credentialId);
    await this._productsService.deleteProductById(id);
    
    return {
      status: 'success',
      message: 'Produk berhasil dihapus',
    };
  }

  async postUploadImageHandler(request, h) {
    const { img } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(img.hapi.headers);
    
    const filename = await this._storageService.writeFile(img, img.hapi);
    
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    
    await this._productsService.editProductImage(id, url);
    
    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        filename,
      },
    });
    response.code(201);
    return response;
  }
}
  
module.exports = ProductHandler;