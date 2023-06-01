/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('purchase_details', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    quantity: {
      type: 'INTEGER',
      notNull: true,
    },
    price: {
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
      notNull: true,
    },
    points: {
      type: 'INTEGER',
      defaultValue: 0,
    },
    status: {
      type: 'VARCHAR(50)',
      defaultValue: 'Belum Lunas',
    },
  });

  pgm.addConstraint('purchase_details', 'fk_purchase_details.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');

  pgm.addConstraint('purchase_details', 'fk_purchase_details.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};
   
exports.down = (pgm) => {
  pgm.dropTable('purchase_details');
};