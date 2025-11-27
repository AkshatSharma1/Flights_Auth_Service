'use strict';
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/server-config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await bcrypt.hash('Admin123', +SALT_ROUNDS);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@airline.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'flightcompany@airline.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // OPTIONAL: Link them to Roles immediately?
    // Ideally, yes. But we need to know the Role IDs.
    // For now, let's just get the users in so we can test Signin.
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Users', {
        email: { [Op.in]: ['admin@airline.com', 'flightcompany@airline.com'] }
    });
  }
};