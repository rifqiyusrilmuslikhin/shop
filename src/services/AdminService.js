const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class AdminService {
  constructor() {
    this._pool = new Pool();
  }

  async addAdmin({ username, password }) {
    await this.verifyNewUsername(username);
    const id = `admin-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'admin';
    const query = {
      text: 'INSERT INTO admin VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, role],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('admin gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllAdmin() {
    const result = await this._pool.query('SELECT * FROM admin');
    return result.rows;
  }

  async getAdminById(adminId) {
    const query = {
      text: 'SELECT id, username FROM admin WHERE id = $1',
      values: [adminId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM admin WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan admin. Username sudah digunakan.');
    }
  }

  async verifyAdminCredential(username, password) {
    const query = {
      text: 'SELECT id, password, role FROM admin WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const { id, password: hashedPassword, role } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return { id, role };
  }
}

module.exports = AdminService;