'use strict';

const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let eventsData = await fs.readFile('./data/events.json', 'utf8')
    eventsData = JSON.parse(eventsData)

    eventsData.forEach(event => {
      event.createdAt = new Date()
      event.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Events', eventsData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Events', null, {});
  }
};
