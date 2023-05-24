/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('purchase_details', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      product_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      quantity: {
        type: 'INTEGER',
        notNull: true,
      },
      // price: {
      //   type: 'NUMERIC(10)',
      //   notNull: true,
      // }
    });

    pgm.addConstraint('purchase_details','fk_purchase_details.product_id_products.id','FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');

    pgm.addConstraint('purchase_details','fk_purchase_details.user_id_users.id','FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  };
   
  exports.down = (pgm) => {
    pgm.dropTable('purchase_details');
  };