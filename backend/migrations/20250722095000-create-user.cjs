'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM('parent', 'child'),
        allowNull: false
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      passkey_credentials: {
        type: Sequelize.JSON,
        allowNull: true
      },
      child_pin_hash: {
        type: Sequelize.STRING,
        allowNull: true
      },
      child_pin_salt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      selected_mascot_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      theme_preference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      language_preference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notification_preferences: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ai_settings: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // No destructive action on rollback
    // Optionally, you can remove columns or enums if needed
  }
};
