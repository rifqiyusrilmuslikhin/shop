const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PurchaseService {
  constructor() {
    this._pool = new Pool();
  }

  async addPurchaseDetails({userId, productId, quantity}) {
    const id = `purchase-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO purchase_details VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, productId, quantity],
    };
  
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Pembelian gagal ditambahkan');
    }

    return result.rows[0].id;
  }
  
  async saveTransactionDetails(userId, totalPurchase, totalPoints) {
    const query = {
      text: 'INSERT INTO transactions VALUES ($1, $2, $3) RETURNING id',
      values: [totalPurchase, totalPoints, userId],
    };
  
    const { rows: [transaction] } = await this._pool.query(query);
    return transaction.id;
  }
  
  async updatePoints(userId, totalPoints) {
    const query = {
      text: 'UPDATE users SET points = points + $1 WHERE id = $2',
      values: [totalPoints, userId],
    };
  
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui points.');
    }
  }
}

module.exports = PurchaseService;
