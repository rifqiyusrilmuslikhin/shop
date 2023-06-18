class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
   
    this.postUserHandler = this.postUserHandler.bind(this);
    this.activateAccountHandler = this.activateAccountHandler.bind(this);
    this.forgotPasswordHandler = this.forgotPasswordHandler.bind(this);
    this.resetPasswordHandler = this.resetPasswordHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUserByCredentialHandler = this.getUserByCredentialHandler.bind(this);
  }
   
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {
      username, password, firstName, lastName, email, phone, address 
    } = request.payload;
 
    const userId = await this._service.addUser({
      username, password, firstName, lastName, email, phone, address
    });
 
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan, Silahkan periksa email anda untuk aktivasi akun',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async activateAccountHandler(request, h) {
    const { token } = request.query;
  
    await this._service.activateAccount(token);
  
    const response = h.response({
      status: 'success',
      message: 'Berhasil Aktivasi Akun',
    });
    response.code(201);
    return response;
  }

  async forgotPasswordHandler(request, h) {
    this._validator.validateForgotPasswordPayload(request.payload);
    const { email } = request.payload;
  
    await this._service.forgotPassword(email);
  
    const response = h.response({
      status: 'success',
      message: 'Silahkan periksa email anda untuk reset password',
    });
    response.code(201);
    return response;
  }

  async resetPasswordHandler(request, h) {
    this._validator.validateResetPasswordPayload(request.payload);
    const { token, password } = request.payload;
  
    await this._service.resetPassword(token, password);
  
    const response = h.response({
      status: 'success',
      message: 'Berhasil Reset Password',
    });
    response.code(201);
    return response;
  }

  async getUsersHandler() {
    const users = await this._service.getAllUser();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async getUserByCredentialHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const user = await this._service.getUserById(credentialId);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}
  
module.exports = UsersHandler;