'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.post, {
        foreignKey: 'userId'
      })
    }
  };
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    isSocial: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    createdAt : {
      type: DataTypes.DATE,
      defaultValue : sequelize.fn('NOW'),
      allowNull : false
    },
    updatedAt : {
      type: DataTypes.DATE,
      defaultValue : sequelize.fn('NOW'),
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};