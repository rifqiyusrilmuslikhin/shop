const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const axios = require('axios');
const InvariantError = require('../exceptions/InvariantError');
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

  async addOrigin({ province, city }) {
    await this.verifyNewOrigin();
    const id = `origin-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO origin VALUES($1, $2, $3) RETURNING id',
      values: [id, province, city],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('origin gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewOrigin() {
    const query = {
      text: 'SELECT id FROM origin LIMIT 1',
    };
  
    const result = await this._pool.query(query);
  
    if (result.rows.length > 0) {
      throw new InvariantError('Tidak boleh lebih dari satu origin');
    }
  }

  async editOrigin(id, { province, city }) {
    const query = {
      text: 'UPDATE origin SET province_id = $1, city_id = $2 WHERE id = $3 RETURNING id',
      values: [province, city, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui origin. Id tidak ditemukan');
    }
  }

  async getAllOrigin() {
    const result = await this._pool.query('SELECT * FROM origin');
    return result.rows;
  }
}

module.exports = ShippingService;
