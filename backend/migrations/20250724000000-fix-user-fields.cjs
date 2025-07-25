'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add name column if it doesn't exist
    try {
      await queryInterface.addColumn('Users', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (error) {
      console.log('Name column might already exist');
    }

    // Modify username to allow null
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'name');
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  }
};