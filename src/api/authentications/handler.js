class AuthenticationsHandler {
  constructor(authenticationsService, usersService, adminService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._adminService = adminService;
    this._tokenManager = tokenManager;
    this._validator = validator;
      
    this.postAdminAuthenticationHandler = this.postAdminAuthenticationHandler.bind(this);
    this.postUserAuthenticationHandler = this.postUserAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }
  
  async postAdminAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
  
    const { username, password } = request.payload;
    const adminId = await this._adminService.verifyAdminCredential(username, password);
  
    const accessToken = this._tokenManager.generateAccessToken({ adminId });
    const refreshToken = this._tokenManager.generateRefreshToken({ adminId });
  
    await this._authenticationsService.addRefreshToken(refreshToken);
  
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async postUserAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    
    const { username, password } = request.payload;
    const userId = await this._usersService.verifyUserCredential(username, password);
    
    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });
    
    await this._authenticationsService.addRefreshToken(refreshToken);
    
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
  
  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationPayload(request.payload);
  
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
  
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }
  
  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
  
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);
  
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}
  
module.exports = AuthenticationsHandler;