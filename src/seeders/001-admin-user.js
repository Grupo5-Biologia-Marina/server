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
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760485034/bo0ny7dwp79n8xaweysr.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'irina',
        firstname: 'Irina',
        lastname: 'Tiron',
        email: 'irinatiron16@gmail.com',
        password: passwordHash,
        role: 'admin',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760090090/irina_fvp1m3.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' });
  },
};