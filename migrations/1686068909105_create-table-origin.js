/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('origin', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    province_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    city_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });
};
   
exports.down = (pgm) => {
  pgm.dropTable('origin');
};