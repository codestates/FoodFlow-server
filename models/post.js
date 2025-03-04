'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.post.belongsTo(models.user, {
        foreignKey: 'userId'
      })
      models.post.belongsTo(models.food, {
        foreignKey: 'foodId'
      })
    }
  };
  post.init({
    text: DataTypes.STRING,
    rating: DataTypes.STRING,
    foodImage: DataTypes.STRING,
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
    modelName: 'post',
  });
  return post;
};