'use strict';
const {
  Model, STRING, DATE
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    is_social: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    createdAt : {
      type: DataTypes.DATE,
      defaultValue : new Date(),
      allowNull : false
    },
    updatedAt : {
      type: DataTypes.DATE,
      defaultValue : new Date(),
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};