'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('post_categories', [
            // Categoría 1 → posts 1 a 5
            { postId: 1, categoryId: 1 },
            { postId: 2, categoryId: 1 },
            { postId: 3, categoryId: 1 },
            { postId: 4, categoryId: 1 },
            { postId: 5, categoryId: 1 },

            // Categoría 2 → posts 6 a 10
            { postId: 6, categoryId: 2 },
            { postId: 7, categoryId: 2 },
            { postId: 8, categoryId: 2 },
            { postId: 9, categoryId: 2 },
            { postId: 10, categoryId: 2 },

            // Categoría 3 → posts 11 a 15
            { postId: 11, categoryId: 3 },
            { postId: 12, categoryId: 3 },
            { postId: 13, categoryId: 3 },
            { postId: 14, categoryId: 3 },
            { postId: 15, categoryId: 3 },

            // Categoría 4 → posts 16 a 20
            { postId: 16, categoryId: 4 },
            { postId: 17, categoryId: 4 },
            { postId: 18, categoryId: 4 },
            { postId: 19, categoryId: 4 },
            { postId: 20, categoryId: 4 },

            // Categoría 5 → posts 20 a 25
            { postId: 21, categoryId: 5 },
            { postId: 22, categoryId: 5 },
            { postId: 23, categoryId: 5 },
            { postId: 24, categoryId: 5 },
            { postId: 25, categoryId: 5 },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('post_categories', null, {});
    }
};