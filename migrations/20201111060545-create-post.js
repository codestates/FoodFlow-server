'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.STRING
      },
      foodImage: {
        type: Sequelize.STRING
      },
       createdAt : {
type: Sequelize.DATE,
defaultValue : Sequelize.fn('NOW'),
allowNull : false
},
updatedAt : {
type: Sequelize.DATE,
defaultValue : Sequelize.fn('NOW'),
allowNull : false
}
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};