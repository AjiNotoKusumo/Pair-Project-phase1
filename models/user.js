'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
const {sendWelcomeEmail} = require('../helpers/sendEmail.js');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, {
        through: models.Reservation,
        foreignKey: 'UserId'
      })

      User.hasMany(models.Event, {
        foreignKey: 'OrganizerId' 
      })

      User.hasOne(models.Profile, {
        foreignKey: 'AccountId' 
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This email address already exist!' 
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Please fill the email field' 
        },
        notEmpty: {
          args: true,
          msg: 'Please fill the email field' 
        },
        isEmail: {
          args: true,
          msg: 'Please provide a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please fill the password field' 
        },
        notEmpty: {
          args: true,
          msg: 'Please fill the password field' 
        },
        len: {
          args: [8,42],
          msg: 'Your password must be between 8 and 42 characters.'
        },
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please choose your role' 
        },
        notEmpty: {
          args: true,
          msg: 'Please choose your role' 
        },
      }
    }
  }, {
    hooks: {
      beforeSave: (user, options) => {
        if(user.changed('password')) {
          const salt = bcrypt.genSaltSync(8)
          const hash = bcrypt.hashSync(user.password, salt)
          
          user.password = hash
        }
      },
      afterCreate: async (user, option) => {
        try {
          const profile = await user.getProfile();
          const fullName = profile ? profile.fullName : 'New User'

          await sendWelcomeEmail(fullName, user.email)
        } catch (error) {
          console.log(error);
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};