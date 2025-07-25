'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'selected_mascot_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Mascots',
        key: 'mascot_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Users', 'notification_preferences', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'ai_settings', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // It's good practice to remove columns in the reverse order they were added.
    await queryInterface.removeColumn('Users', 'ai_settings');
    await queryInterface.removeColumn('Users', 'notification_preferences');
    await queryInterface.removeColumn('Users', 'selected_mascot_id');
  }
};
