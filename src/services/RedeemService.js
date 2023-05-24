const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class RedeemService {
  constructor() {
    this._pool = new Pool();
  }

  async getUserPoints(userId) {
    const query = {
      text: 'SELECT points FROM users WHERE id = $1',
      values: [userId],
    };
  
    const { rows: [user] } = await this._pool.query(query);
    return user.points;
  }
  
  async saveTransactionDetails(userId, transactionAmount) {
    const query = {
      text: 'INSERT INTO transactions VALUES ($1, $2) RETURNING id',
      values: [userId, transactionAmount],
    };
  
    const { rows: [transaction] } = await this._pool.query(query);
    return transaction.id;
  }
  
  async updatePoints(userId, pointsToRedeem) {
    const query = {
      text: 'UPDATE users SET points = points - $1 WHERE id = $2',
      values: [pointsToRedeem, userId],
    };
  
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui points.');
    }
  }  
}

module.exports = RedeemService;
