'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add missing fields to Users table
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true, // Will be required for parents only
      unique: true
    });
    
    await queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true // For child names
    });

    // Update existing fields to match roadmap spec
    await queryInterface.changeColumn('Users', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    });

    await queryInterface.changeColumn('Users', 'parent_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    });

    await queryInterface.changeColumn('Users', 'selected_mascot_id', {
      type: Sequelize.UUID,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes
  }
};