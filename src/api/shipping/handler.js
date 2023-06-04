/* eslint-disable class-methods-use-this */
const axios = require('axios');

class ShippingHandler {
  constructor(shippingService) {
    this._shippingService = shippingService;

    this.getProvincesHandler = this.getProvincesHandler.bind(this);
    this.getCitiesHandler = this.getCitiesHandler.bind(this);
    this.postShippingCostHandler = this.postShippingCostHandler.bind(this);
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

  async postShippingCostHandler(request) {
    const { weight, courier } = request.payload;

    const originDetails = {
      city_id: '409'
    };

    const destinationDetails = {
      city_id: '418'
    };
  
    const response = await axios.post(
      `${process.env.RAJAONGKIR_BASEURL}/starter/cost`,
      {
        origin: originDetails.city_id,
        destination: destinationDetails.city_id,
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
}

module.exports = ShippingHandler;