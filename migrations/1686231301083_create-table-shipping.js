/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('shipping', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    origin: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    destination: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    weight: {
      type: 'INTEGER',
      notNull: true,
    },
    courrier: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    service: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    order_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('shipping', 'fk_shipping.order_id_orders.id', 'FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE');
};
     
exports.down = (pgm) => {
  pgm.dropTable('shipping');
};