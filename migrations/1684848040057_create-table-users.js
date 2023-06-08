/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    first_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    last_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    email: {
      type: 'TEXT',
      unique: true,
      notNull: true,
    },
    phone: {
      type: 'TEXT',
      notNull: true,
    },
    address: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    points: {
      type: 'INTEGER',
      defaultValue: 0,
    },
    activation_token: {
      type: 'VARCHAR(255)',
    },
    is_active: {
      type: 'VARCHAR(255)',
    },
    role: {
      type: 'VARCHAR(50)'
    },
    reset_token: {
      type: 'VARCHAR(255)',
    },
  });
};
   
exports.down = (pgm) => {
  pgm.dropTable('users');
};
