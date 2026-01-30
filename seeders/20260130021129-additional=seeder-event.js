'use strict';

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
    await queryInterface.bulkInsert('Events', [
      {
        title: 'BLACKPINK LIVE IN JAKARTA',
        description: 'BLACKPINK IN YOUR AREA MEGA TOUR CONCERT',
        eventDate: '2026-02-25',
        location: 'ICE BSD CITY',
        imageUrl: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229',
        capacity: 1000,
        OrganizerId: 9,
        CategoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'BRUNO MARS LIVE IN JAKARTA',
        description: 'World Tour Concert 2026',
        eventDate: '2026-03-03',
        location: 'Jakarta International Stadium',
        imageUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2',
        capacity: 1000,
        OrganizerId: 10,
        CategoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'SYNCRONIZE FESTIVAL 2026',
        description: 'Re-live the greatest hits in nostalgic era',
        eventDate: '2026-03-10',
        location: 'JIE EXPO Kemayoran',
        imageUrl: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae',
        capacity: 1000,
        OrganizerId: 10,
        CategoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Tamiya Event Let's & Go",
        description: 'Competitive event for Tamiya builders and meet & greet with the Tamiya community',
        eventDate: '2026-01-31',
        location: 'Q-biq BSD City',
        imageUrl: 'https://images.unsplash.com/photo-1581091012184-5c8d6d6f6c30',
        capacity: 100,
        OrganizerId: 10,
        CategoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'INDOCOMTECH',
        description: 'Exhibition showcasing the latest technology brands in Indonesia for tech enthusiasts',
        eventDate: '2026-05-03',
        location: 'Q-biq BSD City',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        capacity: 500,
        OrganizerId: 10,
        CategoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Aquatic Fantasy',
        description: 'Exhibition and meet & greet event for aquatic enthusiasts from all around Indonesia',
        eventDate: '2026-03-31',
        location: 'ICE BSD City',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        capacity: 100,
        OrganizerId: 10,
        CategoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Zumba Deluxe Move',
        description: 'Fun and energetic zumba event designed to improve your fitness',
        eventDate: '2026-01-31',
        location: 'Q-biq BSD City',
        imageUrl: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b72',
        capacity: 100,
        OrganizerId: 10,
        CategoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Bogor Color Run by Pocari Sweat',
        description: 'Fun and energetic color run event that combines running, music, and vibrant color splashes',
        eventDate: '2026-02-08',
        location: 'Alun-Alun Kota Bogor',
        imageUrl: 'https://images.unsplash.com/photo-1546484959-f9a7c9a9d2b6',
        capacity: 150,
        OrganizerId: 10,
        CategoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'JACK-CLOTH',
        description: 'A fashion and lifestyle event that brings together local clothing brands, streetwear communities, and creative enthusiasts',
        eventDate: '2026-03-20',
        location: 'Parkir Timur Senayan',
        imageUrl: 'https://images.unsplash.com/photo-1521334884684-d80222895322',
        capacity: 150,
        OrganizerId: 10,
        CategoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'URBAN SNEAKERS SOCIETY',
        description: 'A lifestyle event that brings together sneaker enthusiasts, streetwear lovers, and creative communities',
        eventDate: '2026-04-05',
        location: 'Jakarta Convention Center',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        capacity: 500,
        OrganizerId: 10,
        CategoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
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
