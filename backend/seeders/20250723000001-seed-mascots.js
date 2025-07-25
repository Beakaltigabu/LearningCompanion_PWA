'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mascots = [
      {
        id: uuidv4(),
        name: 'Sparky the Dragon',
        image_url: '/assets/mascots/sparky.png',
        unlock_level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Professor Hoot',
        image_url: '/assets/mascots/hoot.png',
        unlock_level: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Cosmo the Alien',
        image_url: '/assets/mascots/cosmo.png',
        unlock_level: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Mascots', mascots, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Mascots', null, {});
  },
};
