/* eslint-disable camelcase */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
// const AuthorizationError = require('../exceptions/AuthorizationError');

class PurchaseService {
  constructor() {
    this._pool = new Pool();
  }

  async addPurchaseDetails({
    productId, userId, quantity, price, payment, remainingPayment, points, status 
  }) {
    const id = `purchase-${nanoid(16)}`;
    const pointsValue = points || 0;
    const paymentValue = payment || 0;
    const remaining_payment = remainingPayment || (price - paymentValue);
    const purchaseStatus = status || 'Pending';
    const query = {
      text: 'INSERT INTO purchase_details VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, productId, userId, quantity, price, paymentValue, remaining_payment, pointsValue, purchaseStatus],
    };
  
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Pembelian gagal ditambahkan');
    }

    return result.rows[0].id;
  }
  
  async updatePoints(userId, totalPoints) {
    const query = {
      text: 'UPDATE users SET points = points + $1 WHERE id = $2',
      values: [totalPoints, userId],
    };
  
    await this._pool.query(query);
  }

  async getAllPurchase() {
    const result = await this._pool.query('SELECT * FROM purchase_details');
    return result.rows;
  }

  async updatePointsAfterRedeem(userId, pointsToRedeem) {
    const query = {
      text: 'UPDATE users SET points = points - $1 WHERE id = $2',
      values: [pointsToRedeem, userId],
    };
  
    await this._pool.query(query);
  }

  async getDetailPurchase(id) {
    const query = {
      text: 'SELECT purchase_details.id, users.username, users.points, purchase_details.product_id, products.product_name, purchase_details.quantity, products.price, purchase_details.price as total_price, purchase_details.remaining_payment, purchase_details.points as redeem FROM purchase_details join products on purchase_details.product_id = products.id join users on  purchase_details.user_id = users.id where purchase_details.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Pembelian tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPurchaseByUser(id, user_id) {
    const query = {
      text: 'SELECT purchase_details.id, users.username, users.points, products.product_name, purchase_details.quantity, products.price, purchase_details.price as total_price, purchase_details.remaining_payment, purchase_details.points as redeem FROM purchase_details join products on purchase_details.product_id = products.id join users on purchase_details.user_id = users.id where purchase_details.id = $1 and purchase_details.user_id = $2',
      values: [id, user_id]
    };

    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new NotFoundError('Pembelian tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPurchaseById(id) {
    const query = {
      text: 'SELECT purchase_details.id, users.username, users.points, products.product_name, purchase_details.quantity, products.price, purchase_details.price as total_price, purchase_details.remaining_payment, purchase_details.points as redeem FROM purchase_details join products on purchase_details.product_id = products.id join users on  purchase_details.user_id = users.id where purchase_details.id = $1',
      values: [id]
    };

    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new NotFoundError('Pembelian tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = PurchaseService;
