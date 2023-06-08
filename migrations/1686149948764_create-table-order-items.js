/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    items: {
      type: 'JSONB[]',
      notNull: true
    },
    total_price: {
      type: 'NUMERIC(10)',
      notNull: true,
    },
    payment: {
      type: 'NUMERIC(10)',
      notNull: true,
      defaultValue: 0
    },
    remaining_payment: {
      type: 'NUMERIC(10)',
      notNull: false,
    },
    points: {
      type: 'INTEGER',
      notNull: true,
      defaultValue: 0,
    },
    status: {
      type: 'VARCHAR(50)',
      defaultValue: 'Pending',
    },
    order_date: {
      type: 'DATE',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('orders', 'fk_orders.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};
       
exports.down = (pgm) => {
  pgm.dropTable('orders');
};
