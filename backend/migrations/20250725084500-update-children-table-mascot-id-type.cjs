'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, remove the old column if it exists with the wrong type
    try {
      await queryInterface.removeColumn('Children', 'selected_mascot_id');
    } catch (error) {
      console.log('Column selected_mascot_id did not exist, which is fine.');
    }

    // Now, add the new column with the correct type and foreign key reference
    await queryInterface.addColumn('Children', 'selected_mascot_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Mascots',
        key: 'mascot_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    // To revert, we'll just remove the column. 
    // Reverting back to a UUID without a proper reference is less ideal.
    await queryInterface.removeColumn('Children', 'selected_mascot_id');
  }
};
