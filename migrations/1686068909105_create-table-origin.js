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
    },
    admin_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('origin', 'fk_origin.admin_id_admin.id', 'FOREIGN KEY(admin_id) REFERENCES admin(id) ON DELETE CASCADE');
};
   
exports.down = (pgm) => {
  pgm.dropTable('origin');
};