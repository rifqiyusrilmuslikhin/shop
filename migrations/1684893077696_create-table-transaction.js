/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('transactions', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      total_purchase: {
        type: 'INTEGER',
        defaultValue: 0,
      },
      total_points: {
        type: 'INTEGER',
        defaultValue: 0,
      },
      transaction_amount: {
        type: 'INTEGER',
        defaultValue: 0,
      }
    });

    pgm.addConstraint('transactions','fk_transactions.user_id_users.id','FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  };
   
  exports.down = (pgm) => {
    pgm.dropTable('transactions');
  };