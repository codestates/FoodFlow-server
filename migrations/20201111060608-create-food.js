'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      foodCategory: {
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
    await queryInterface.dropTable('food');
  }
};