'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: '🐠 Vida Marina',
        description: 'Descubre las criaturas fascinantes que habitan los océanos, desde corales y medusas hasta tiburones y ballenas.',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082986/marine-life_plsxer.png',
      },
      {
        name: '🌊 Ecosistemas Oceánicos',
        description: 'Explora los ecosistemas marinos: arrecifes, abismos, costas y sus delicados equilibrios naturales.',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082986/ocean-ecosystems_gcdz5g.png',
      },
      {
        name: '🔬 Ciencia y Exploración',
        description: 'Acompaña a los científicos en sus investigaciones y descubre cómo se estudia la vida en las profundidades.',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082985/science-exploration_avjfbv.png',
      },
      {
        name: '⚠️ Problemas y Amenazas',
        description: 'Conoce los peligros que enfrentan los mares: contaminación, cambio climático y sobrepesca.',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082985/problems-threats_muxnh2.png',
      },
      {
        name: '🌍 Regiones y Océanos del Mundo',
        description: 'Explora los océanos del planeta: Atlántico, Pacífico, Índico, Ártico y Antártico.',
        img: 'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082989/world-regions_lr5pbp.png',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};