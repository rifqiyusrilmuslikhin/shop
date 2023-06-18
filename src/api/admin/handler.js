class AdminHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
   
    this.postAdminHandler = this.postAdminHandler.bind(this);
    this.getAllAdminHandler = this.getAllAdminHandler.bind(this);
    this.getAdminByCredentialHandler = this.getAdminByCredentialHandler.bind(this);
    this.putAdminHandler = this.putAdminHandler.bind(this);
  }
   
  async postAdminHandler(request, h) {
    this._validator.validateAdminPayload(request.payload);
    const { username, password } = request.payload;
    const adminId = await this._service.addAdmin({ username, password });
   
    const response = h.response({
      status: 'success',
      message: 'Admin berhasil ditambahkan',
      data: {
        adminId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllAdminHandler() {
    const admin = await this._service.getAllAdmin();
    return {
      status: 'success',
      data: {
        admin,
      },
    };
  }

  async getAdminByCredentialHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const admin = await this._service.getAdminById(credentialId);

    return {
      status: 'success',
      data: {
        admin,
      },
    };
  }

  async putAdminHandler(request) {
    this._validator.validateAdminPayload(request.payload);
    const { username, password } = request.payload;
    const { id } = request.params;
    
    await this._service.editAdmin(id, { username, password });
    
    return {
      status: 'success',
      message: 'Admin berhasil diperbarui',
    };
  }
}
  
module.exports = AdminHandler;