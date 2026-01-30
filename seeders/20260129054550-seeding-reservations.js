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
    let reservationsData = await fs.readFile('./data/reservations.json', 'utf8')
    reservationsData = JSON.parse(reservationsData)

    reservationsData.forEach(reservation => {
      reservation.createdAt = new Date()
      reservation.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Reservations', reservationsData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
