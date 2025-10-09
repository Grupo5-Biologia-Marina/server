'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: '🐠 Vida Marina',
        description: 'Descubre las criaturas fascinantes que habitan los océanos, desde corales y medusas hasta tiburones y ballenas.',
      },
      {
        name: '🌊 Ecosistemas Oceánicos',
        description: 'Explora los ecosistemas marinos: arrecifes, abismos, costas y sus delicados equilibrios naturales.',
      },
      {
        name: '🔬 Ciencia y Exploración',
        description: 'Acompaña a los científicos en sus investigaciones y descubre cómo se estudia la vida en las profundidades.',
      },
      {
        name: '⚠️ Problemas y Amenazas',
        description: 'Conoce los peligros que enfrentan los mares: contaminación, cambio climático y sobrepesca.',
      },
      {
        name: '🌍 Regiones y Océanos del Mundo',
        description: 'Explora los océanos del planeta: Atlántico, Pacífico, Índico, Ártico y Antártico.',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};