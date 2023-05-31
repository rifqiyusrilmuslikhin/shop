class UsersHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
   
      this.postUserHandler = this.postUserHandler.bind(this);
      this.getAllUserHandler = this.getAllUserHandler.bind(this);
    }
   
    async postUserHandler(request, h) {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname, email, phone, address } = request.payload;
   
      const userId = await this._service.addUser({ username, password, fullname, email, phone, address });
   
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
  }
  
  module.exports = UsersHandler;