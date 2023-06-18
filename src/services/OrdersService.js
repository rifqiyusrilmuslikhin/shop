/* eslint-disable no-restricted-syntax */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class OrdersService {
  constructor(productsService, usersService) {
    this._productsService = productsService;
    this._usersService = usersService;
    this._pool = new Pool();
  }

  // eslint-disable-next-line camelcase
  async addOrder(orderData, userId, remaining_payment, points) {
    const { items } = orderData;
  
    let totalPrice = 0;
    // eslint-disable-next-line no-restricted-syntax

    for (const item of items) {
      const { productId, quantity } = item;
  
      // eslint-disable-next-line no-await-in-loop
      const product = await this._productsService.getProductById(productId);
      if (!product) {
        throw new NotFoundError('Produk tidak ditemukan');
      }
  
      const { discount_price: price } = product;
  
      totalPrice += price * quantity;

      // eslint-disable-next-line no-await-in-loop
      await this._productsService.updateStockProductAfterOrder(productId, quantity);
    }

    if (totalPrice > 100000) {
      const purchasePoints = Math.floor(totalPrice / 100000);
      await this._usersService.updatePoints(userId, purchasePoints);
    }

    const id = `order-${nanoid(16)}`;
    const date = new Date().toISOString();
    const pointsValue = points || 0;

    const transactionAmount = pointsValue * 20000;

    if (pointsValue) {      
      await this._usersService.updatePointsAfterRedeem(credentialId, points);
    }

    const status = 'pending';
    // eslint-disable-next-line camelcase
    const remainingPayment = remaining_payment || (totalPrice - transactionAmount);
    
    const orderQuery = {
      text: 'INSERT INTO orders VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, items.map(JSON.stringify), totalPrice, transactionAmount, remainingPayment, pointsValue, status, date, userId],
    };
    const result = await this._pool.query(orderQuery);
    return result.rows[0].id;
  }

  async getAllItem() {
    const result = await this._pool.query('SELECT * FROM orders');
    return result.rows;
  }

  async getPendingOrders() {
    const result = await this._pool.query("SELECT * FROM orders WHERE status = 'pending'");
    return result.rows;
  }

  async getSuccessOrders() {
    const result = await this._pool.query("SELECT * FROM orders WHERE status = 'success'");
    return result.rows;
  }

  async getUserItem(userId) {
    const query = {
      text: 'SELECT * FROM orders WHERE user_id = $1',
      values: [userId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data tidak ditemukan');
    }
    return result.rows;
  }

  async getDetailOrder(id){
    const query = {
      text: 'SELECT * FROM orders WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Order tidak ditemukan');
    }

    return result.rows[0];
  }

  async editStatusOrderById(orderId, newStatus) {
    const orderQuery = {
      text: 'SELECT * FROM orders WHERE id = $1',
      values: [orderId],
    };
    const orderResult = await this._pool.query(orderQuery);
  
    if (orderResult.rows.length === 0) {
      throw new NotFoundError('Order not found');
    }
  
    const order = orderResult.rows[0];
  
    if (order.status === newStatus) {
      throw new BadRequestError(`Order status is already "${newStatus}"`);
    }
  
    if (newStatus === 'failed') {
      const { items } = order;
  
      for (const item of items) {
        const { productId, quantity } = item;
  
        const productQuery = {
          text: 'SELECT * FROM products WHERE id = $1',
          values: [productId],
        };
  
        // eslint-disable-next-line no-await-in-loop
        const productResult = await this._pool.query(productQuery);
  
        if (productResult.rows.length === 0) {
          throw new NotFoundError(`Product with id ${productId} not found`);
        }
  
        const product = productResult.rows[0];
        const newStock = product.stock + quantity;
  
        const updateProductQuery = {
          text: 'UPDATE products SET stock = stock + $1 WHERE id = $2',
          values: [quantity, productId],
        };
  
        // eslint-disable-next-line no-await-in-loop
        await this._pool.query(updateProductQuery);
      }
    }
  
    const updateOrderQuery = {
      text: 'UPDATE orders SET status = $1 WHERE id = $2',
      values: [newStatus, orderId],
    };
    await this._pool.query(updateOrderQuery);
  
    return true;
  }
}

module.exports = OrdersService;