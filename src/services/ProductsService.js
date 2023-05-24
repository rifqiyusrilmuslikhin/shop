const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct({ productName, price, owner }) {
    const id = `product-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, productName, price, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Produk gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllProduct() {
    const result = await this._pool.query('SELECT * FROM products');
    return result.rows;
  }

  async getProductById(id) {
    const query = {
      text: `SELECT products.id, products.product_name, products.price FROM products WHERE products.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    return result.rows[0];
  }

  async getProductPrice(id) {
    const query = {
      text: `SELECT id, price FROM products WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    return result.rows[0];
  }

  async editProductById(id, { productName, price }) {
    const query = {
      text: 'UPDATE products SET product_name = $1, price = $2 WHERE id = $3 RETURNING id',
      values: [productName, price, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui produk. Id tidak ditemukan');
    }
  }

  async deleteProductById(id) {
    const query = {
      text: 'DELETE FROM products WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Produk gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyProductOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Produk tidak ditemukan');
    }
    const product = result.rows[0];
    if (product.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = ProductsService;
