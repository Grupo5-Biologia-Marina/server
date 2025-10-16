'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('likes', [
      { userId: 1, postId: 1 },
      { userId: 2, postId: 1 },
      { userId: 2, postId: 2 },
      { userId: 1, postId: 3 },
      { userId: 2, postId: 3 },
      { userId: 1, postId: 4 },
      { userId: 2, postId: 4 },
      { userId: 2, postId: 5 },
      { userId: 1, postId: 15 },
      { userId: 2, postId: 15 },
      { userId: 2, postId: 16 },
      { userId: 1, postId: 19 },
      { userId: 2, postId: 19 },
      { userId: 1, postId: 22 },
      { userId: 2, postId: 24 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('likes', {
      userId: [1, 2],
      postId: [1,2,3,4,5,15,16,19,22,24]
    }, {});
  }
};
