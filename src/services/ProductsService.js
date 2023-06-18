const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct({
    productName, description, price, discount, stock, owner 
  }) {
    const id = `product-${nanoid(16)}`;
    const discountProduct = discount || 0;
    const discountProductPrice = price - ((discount / 100) * price) || price;

    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, productName, description, price, discountProduct, discountProductPrice, stock, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Produk gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllProduct({ productName = '', description = '' }) {
    const query = {
      text: 'SELECT * FROM products WHERE product_name ILIKE $1 AND description ILIKE $2',
      values: [`%${productName}%`, `%${description}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getProductById(id) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
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
      text: 'SELECT id, price FROM products WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    return result.rows[0];
  }

  async editProductById(id, {
    productName, description, price, discount, stock 
  }) {
    const discountProduct = discount || 0;
    const discountProductPrice = price - ((discount / 100) * price) || price;
    const query = {
      text: 'UPDATE products SET product_name = $1, description = $2, price = $3, discount = $4, discount_price = $5, stock = $6 WHERE id = $7 RETURNING id',
      values: [productName, description, price, discountProduct, discountProductPrice, stock, id],
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

  async editProductImage(id, img){
    const query = {
      text: 'UPDATE products SET img = $1 WHERE id = $2 RETURNING id',
      values: [img, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui produk. Id tidak ditemukan');
    }

    return {
      status: 'success',
      message: 'Produk berhasil diperbarui',
    };
  }

  async updateStockProductAfterOrder(productId, quantity) {
    const query = {
      text: 'UPDATE products SET stock = stock - $1 WHERE id = $2',
      values: [quantity, productId],
    };
  
    await this._pool.query(query);
  }
}

module.exports = ProductsService;
