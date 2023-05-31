const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PurchaseService {
  constructor() {
    this._pool = new Pool();
  }

  async addPurchaseDetails({productId, userId, quantity, price, payment, remainingPayment, points, status}) {
    const id = `purchase-${nanoid(16)}`;
    const pointsValue = points || 0;
    const paymentValue = payment || 0;
    const remaining_payment = remainingPayment || (price && price-paymentValue);
    const purchaseStatus = status || 'Belum Lunas';
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

  async updatePointsAfterRedeem(userId, pointsToRedeem) {
    const query = {
      text: 'UPDATE users SET points = points - $1 WHERE id = $2',
      values: [pointsToRedeem, userId],
    };
  
    await this._pool.query(query);
  }
}

module.exports = PurchaseService;
