'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.food.hasMany(models.post, {
        foreignKey: 'foodId'
      })
    }
  };
  food.init({
    name: DataTypes.STRING,
    foodCategory: DataTypes.STRING,
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
    modelName: 'food',
  });
  return food;
};