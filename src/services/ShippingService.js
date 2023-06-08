const { Pool } = require('pg');
// const { nanoid } = require('nanoid');
const axios = require('axios');
// const InvariantError = require('../exceptions/InvariantError');
// const NotFoundError = require('../exceptions/NotFoundError');
// const AuthorizationError = require('../exceptions/AuthorizationError');

class ShippingService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getProvince() {
    const key = 'province';
    try {
      const result = await this._cacheService.get(key);
      return { data: result, isCache: true };
    } catch (error) {
      const response = await axios.get(`${process.env.RAJAONGKIR_BASEURL}/starter/province`, {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      });
  
      await this._cacheService.set(key, response.data);
  
      return { 
        data: response.data, 
        isCache: false 
      };
    }
  }

  async getCities() {
    const key = 'city';
    try {
      const result = await this._cacheService.get(key);
      return { data: result, isCache: true };
    } catch (error) {
      const response = await axios.get(`${process.env.RAJAONGKIR_BASEURL}/starter/city`, {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      });
  
      await this._cacheService.set(key, response.data);
  
      return { 
        data: response.data, 
        isCache: false 
      };
    }
  }

  async getCityById(provinceId) {
    const key = `cities:${provinceId}`;
    try {
      const result = await this._cacheService.get(key);
      return { data: JSON.parse(result), isCache: true };
    } catch (error) {
      const response = await axios.get(`${process.env.RAJAONGKIR_BASEURL}/starter/city`, {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
        params: {
          province: provinceId,
        },
      });
  
      await this._cacheService.set(key, JSON.stringify(response.data));
  
      return { 
        data: response.data, 
        isCache: false 
      };
    }
  }
}

module.exports = ShippingService;
