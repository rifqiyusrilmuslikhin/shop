/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('admin', {
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
    role: {
      type: 'VARCHAR(50)'
    }
  });
};
   
exports.down = (pgm) => {
  pgm.dropTable('admin');
};