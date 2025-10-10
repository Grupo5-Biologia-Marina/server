'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true, 
      },
      postId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true, 
      },
    }, {
      engine: 'InnoDB',
      timestamps: false, 
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('likes');
  },
};