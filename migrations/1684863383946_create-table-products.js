/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('products', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      product_name: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      description: {
        type: 'TEXT',
        notNull: true,
      },
      price: {
        type: 'NUMERIC(10)',
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      img: {
        type: 'VARCHAR(255)',
        notNull: false,
      },
    });

    pgm.addConstraint('products','fk_products.owner_admin.id','FOREIGN KEY(owner) REFERENCES admin(id) ON DELETE CASCADE');
  };
   
  exports.down = (pgm) => {
    pgm.dropTable('products');
  };