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
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    email: {
      type: 'TEXT',
      notNull: true,
    },
    phone: {
      type: 'TEXT',
      notNull: true,
    },
    address: {
      type: 'TEXT',
      notNull: true,
    },
    points: {
      type: 'INTEGER',
      defaultValue: 0,
    },
  });
};
   
exports.down = (pgm) => {
  pgm.dropTable('users');
};
