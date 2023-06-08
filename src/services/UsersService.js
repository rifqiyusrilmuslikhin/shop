const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username, password, firstName, lastName, email, phone, address, points,  
  }) {
    await this.verifyNewEmail(email);
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const pointValue = points || 0;
    const activationToken = crypto.randomBytes(20).toString('hex');
    const role = 'user';
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
      values: [id, username, hashedPassword, firstName, lastName, email, phone, address, pointValue, activationToken, false, role],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Account Activation',
      text: `Click the following link to activate your account: http://localhost:4001/activate?token=${activationToken}`,
    };
  
    await transporter.sendMail(mailOptions);

    return result.rows[0].id;
  }

  async activateAccount(token) {
    const query = {
      text: 'UPDATE users SET is_active = $1 WHERE activation_token = $2',
      values: [true, token],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Gagal aktivasi akun. token tidak ditemukan');
    }
  }

  async forgotPassword(email) {
    const token = crypto.randomBytes(20).toString('hex');
    const query = {
      text: 'UPDATE users SET reset_token = $1 WHERE email = $2',
      values: [token, email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Gagal memperbarui password. token tidak ditemukan');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Reset Password',
      text: `Reset your password by clicking the following link: http://localhost:4001/reset-password?token=${token}`,
    };
  
    await transporter.sendMail(mailOptions);
  }

  async resetPassword(token, password){
    const query = {
      text: 'SELECT * FROM users WHERE reset_token = $1',
      values: [token],
    };
  
    const result = await this._pool.query(query);
    const user = result.rows[0];
  
    if (!user) {
      throw new NotFoundError('Token tidak ditemukan');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateQuery = {
      text: 'UPDATE users SET password = $1, reset_token = NULL WHERE id = $2',
      values: [hashedPassword, user.id]
    };
  
    await this._pool.query(updateQuery);
  }

  async getAllUser() {
    const result = await this._pool.query('SELECT * FROM users');
    return result.rows;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password, role, is_active FROM users WHERE username = $1',
      values: [username],
    };
  
    const result = await this._pool.query(query);
  
    if (!result.rows.length) {
      throw new NotFoundError('Akun tidak ditemukan');
    }
  
    const {
      id, password: hashedPassword, role, is_active: isActive 
    } = result.rows[0];

    if (isActive !== 'true') {
      throw new AuthenticationError('Silahkan aktivasi akun dulu');
    }
  
    const match = await bcrypt.compare(password, hashedPassword);
  
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
  
    return { id, role };
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

module.exports = UsersService;