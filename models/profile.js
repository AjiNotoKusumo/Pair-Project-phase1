'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'AccountId'
      })
    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide your full name' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide your full name' 
        },
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Please provide a valid phone Number' 
        }
      }
    },
    avatarUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          args: true,
          msg: 'Please provide a image link' 
        }
      }
    },
    AccountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};