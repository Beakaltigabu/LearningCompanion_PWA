'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if 'name' column exists and remove it if it does
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (tableDescription.name) {
      await queryInterface.removeColumn('Users', 'name');
    }

    // Ensure all required columns exist
    const requiredColumns = {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('parent', 'child'),
        allowNull: false,
        defaultValue: 'parent',
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      passkey_credentials: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      child_pin_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      child_pin_salt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      selected_mascot_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      theme_preference: {
        type: Sequelize.STRING,
        defaultValue: 'sunshine',
      },
      language_preference: {
        type: Sequelize.STRING,
        defaultValue: 'en',
      },
      notification_preferences: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      ai_settings: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
    };

    // Add missing columns
    for (const [columnName, columnDefinition] of Object.entries(requiredColumns)) {
      if (!tableDescription[columnName]) {
        await queryInterface.addColumn('Users', columnName, columnDefinition);
      }
    }

    // Add unique constraint on username if it doesn't exist
    try {
      await queryInterface.addIndex('Users', ['username'], {
        unique: true,
        name: 'users_username_unique'
      });
    } catch (error) {
      // Index might already exist, ignore error
      console.log('Username unique index already exists or failed to create:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // This migration is primarily additive, so down migration is minimal
    await queryInterface.removeIndex('Users', 'users_username_unique');
  }
};