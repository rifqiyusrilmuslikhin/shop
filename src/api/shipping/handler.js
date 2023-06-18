/* eslint-disable class-methods-use-this */
const axios = require('axios');

class ShippingHandler {
  constructor(shippingService, validator) {
    this._shippingService = shippingService;
    this._validator = validator;

    this.getProvincesHandler = this.getProvincesHandler.bind(this);
    this.getCitiesHandler = this.getCitiesHandler.bind(this);
    this.getCitiesByProvinceIdHandler = this.getCitiesByProvinceIdHandler.bind(this);
    this.postShippingCostHandler = this.postShippingCostHandler.bind(this);
    this.postShippingValue = this.postShippingValue.bind(this);
    this.postOriginHandler = this.postOriginHandler.bind(this);
    this.putOriginHandler = this.putOriginHandler.bind(this);
    this.getOriginHandler = this.getOriginHandler.bind(this);
  }

  async getProvincesHandler(request, h) {
    const { data, isCache } = await this._shippingService.getProvince();

    const response = h.response({
      status: 'success',
      data: {
        data,
      },
    });
    response.header('X-Data-Source', isCache ? 'cache' : 'db');
    return response;
  }

  async getCitiesHandler(request, h) {
    const { data, isCache } = await this._shippingService.getCities();

    const response = h.response({
      status: 'success',
      data: {
        data,
      },
    });
    response.header('X-Data-Source', isCache ? 'cache' : 'db');
    return response;
  }

  async getCitiesByProvinceIdHandler(request, h) {
    const { provinceId } = request.params;
    const { data, isCache } = await this._shippingService.getCityById(provinceId);

    const response = h.response({
      status: 'success',
      data: {
        data,
      },
    });
    response.header('X-Data-Source', isCache ? 'cache' : 'db');
    return response;
  }

  async postShippingCostHandler(request) {
    const {
      origin, destination, weight, courier 
    } = request.payload;
    const response = await axios.post(
      `${process.env.RAJAONGKIR_BASEURL}/starter/cost`,
      {
        origin,
        destination,
        weight,
        courier,
      },
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  
    return response.data;
  }

  async postShippingValue(request, h) {
    const {
      origin, destination, weight, courier, service 
    } = request.payload;

    const response = await axios.post(`${process.env.RAJAONGKIR_BASEURL}/starter/cost`, {
      origin,
      destination,
      weight,
      courier,
      service,
    }, {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
      },
    });

    const { data } = response;
    const { results } = data.rajaongkir;

    const selectedCourier = results.find((result) => result.code === courier);

    if (!selectedCourier) {
      return h.response({ error: 'Courier not found' }).code(404);
    }

    const selectedService = selectedCourier.costs.find((result) => result.service === service);

    return { results: selectedService.cost };
  }

  async postOriginHandler(request, h) {
    this._validator.validateOriginPayload(request.payload);
    const { province, city } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const originId = await this._shippingService.addOrigin({ province, city, admin_id: credentialId });
   
    const response = h.response({
      status: 'success',
      message: 'Origin berhasil ditambahkan',
      data: {
        originId,
      },
    });
    response.code(201);
    return response;
  }

  async putOriginHandler(request) {
    this._validator.validateOriginPayload(request.payload);
    const { province, city } = request.payload;
    const { id } = request.params;
    
    await this._shippingService.editOrigin(id, { province, city });
    
    return {
      status: 'success',
      message: 'Origin berhasil diperbarui',
    };
  }

  async getOriginHandler() {
    const origin = await this._shippingService.getAllOrigin();
    return {
      status: 'success',
      data: {
        origin,
      },
    };
  }
}

module.exports = ShippingHandler;