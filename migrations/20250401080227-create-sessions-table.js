'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      sess: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      expire: {
        type: Sequelize.DATE(6),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('session', ['expire'], {
      name: 'IDX_session_expire',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session');
  },
};
