'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Mascots');
    
    // Check if mascot_id column exists, if not add it
    if (!tableDescription.mascot_id) {
      // If there's an 'id' column, rename it to 'mascot_id'
      if (tableDescription.id) {
        await queryInterface.renameColumn('Mascots', 'id', 'mascot_id');
      } else {
        // Add mascot_id as primary key
        await queryInterface.addColumn('Mascots', 'mascot_id', {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert changes if needed
    const tableDescription = await queryInterface.describeTable('Mascots');
    if (tableDescription.mascot_id && !tableDescription.id) {
      await queryInterface.renameColumn('Mascots', 'mascot_id', 'id');
    }
  }
};