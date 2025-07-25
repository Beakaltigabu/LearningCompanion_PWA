'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mascots', {
      mascot_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_am: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      animation_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      unlock_cost_points: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unlock_achievement_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      customizable_options: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Mascots');
  }
};
