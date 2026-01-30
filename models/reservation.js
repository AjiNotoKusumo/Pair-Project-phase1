'use strict';
const {
  Model
} = require('sequelize');
const { sendReservationEmail } = require('../helpers/sendEmail.js');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User); 
      Reservation.belongsTo(models.Event);
    }
  }
  Reservation.init({
    UserId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (reservation, options) => {
        reservation.status = 'Reserved'
      },
      afterCreate: async (reservation, option) => {
        try {
          // const fullReservation = await sequelize.models.Reservation.findByPk(reservation.id, {
          //   include: [
          //     { 
          //       model: sequelize.models.User, 
          //       include: [sequelize.models.Profile]
          //     },
          //     { model: sequelize.models.Event } 
          //   ],
            
          // });

          // if (!fullReservation) return;

          // const { User, Event } = fullReservation;
          // const email = User.email;
          // const fullName = User.Profile.fullName;
          // const title = Event.title
          // const location = Event.location
          // const eventDate = Event.eventDate

          // await sendReservationEmail(email, fullName, title, location, eventDate)

          console.log(`reservation email sent successfully`);
        
        } catch (error) {
          console.log(error);
          
        }
      }
    },
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};