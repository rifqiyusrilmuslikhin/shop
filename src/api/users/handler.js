class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
   
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getAllUserHandler = this.getAllUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }
   
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {
      username, password, fullname, email, phone, address 
    } = request.payload;
   
    const userId = await this._service.addUser({
      username, password, fullname, email, phone, address 
    });
   
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllUserHandler() {
    const users = await this._service.getAllUser();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }

  async getUserByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const user = await this._service.getUserById(credentialId);

    return {
      status: 'success',
      data: {
        user
      },
    };
  }
}
  
module.exports = UsersHandler;