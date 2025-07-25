'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check current table structure
    const tableDescription = await queryInterface.describeTable('Users');
    console.log('Current table structure:', Object.keys(tableDescription));
    
    // Remove name column if it exists
    if (tableDescription.name) {
      console.log('Removing name column...');
      await queryInterface.removeColumn('Users', 'name');
    }

    // Add missing columns
    const columnsToAdd = {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'temp_user'
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
      }
    };

    for (const [columnName, columnDefinition] of Object.entries(columnsToAdd)) {
      if (!tableDescription[columnName]) {
        console.log(`Adding column: ${columnName}`);
        await queryInterface.addColumn('Users', columnName, columnDefinition);
      }
    }

    // Add unique constraint on username
    try {
      await queryInterface.addIndex('Users', ['username'], {
        unique: true,
        name: 'users_username_unique'
      });
    } catch (error) {
      console.log('Username unique index already exists or failed:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns and constraints
    try {
      await queryInterface.removeIndex('Users', 'users_username_unique');
    } catch (error) {
      console.log('Could not remove index:', error.message);
    }
  }
};