'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profileImage: {
        type: Sequelize.STRING
      },
      isSocial: {
        type: Sequelize.BOOLEAN
      },
      isActive: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('users');
  }
};