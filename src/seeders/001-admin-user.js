'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('adminpassword', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' });
  },
};