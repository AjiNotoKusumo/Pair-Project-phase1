'use strict';
const {
  Model,
  Sequelize,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User, {
        through: models.Reservation,
        foreignKey: 'EventId'
      })

      Event.belongsTo(models.User, {
        foreignKey: 'OrganizerId'
      })

      Event.belongsTo(models.Category, {
        foreignKey: 'CategoryId'
      })
    }

    get formatDate(){
      return `${this.eventDate.getFullYear()}-${
        String(this.eventDate.getMonth() + 1).padStart(2, '0')
      }-${
        String(this.eventDate.getDate()).padStart(2, '0')
      }`
    }

    get formatDateName(){
      return {
        weekday: new Date(this.eventDate).toLocaleString(undefined, { weekday: 'short' }),
        month: new Date(this.eventDate).toLocaleString(undefined, { month: 'long' }),
        day: new Date(this.eventDate).toLocaleString(undefined, { day: '2-digit' })
      } 
    }

    static async showEvents(search, sort, CategoryId, startDate, endDate){
      let sortRule = {
        Upcoming: ['eventDate', 'ASC'],
        Newest: ['createdAt', 'ASC'],
        Latest: ['eventDate', 'DESC'],
        'Most Popular': ['attendeesCount', 'DESC'],
        'Least Popular': ['attendeesCount', 'ASC']
      }

      const option = {
        attributes: ['id', 'title', 'eventDate', 'location', 'imageUrl', [Sequelize.fn('COUNT', Sequelize.col('Users.id')), 'attendeesCount']],
        include: [{
          model: this.sequelize.models.User,
          attributes: [],
          through: { 
            model: this.sequelize.models.Reservation, 
            attributes: [],
            where: {
                status: 'Reserved'
            } 
          } 
        }],
        where: {
            eventDate: {
                [Op.gte]: new Date()
            }
        },
        order: [['id', 'ASC']],
        group: ['Event.id','Event.title', 'Event.eventDate', 'Event.location', 'Event.capacity'],
        having: Sequelize.where(
            Sequelize.fn('COUNT', Sequelize.col('Users.id')),
            {
                [Op.lt]: Sequelize.col('Event.capacity')
            }
        )
      }

      if(startDate){
        if(endDate) {
            option.where.eventDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        } else {
            option.where.eventDate = {
                [Op.gte]: new Date(startDate)
            }
        }
      } else {
        if(endDate) {
            option.where.eventDate = {
                [Op.between]: [new Date(), new Date(endDate)]
            }
        }
      }

      if(sort){
        option.order = [sortRule[sort]]
      }

      if(search){
        option.where.title = {
            [Op.iLike]: `%${search}%`
        }
      }

      if(CategoryId){
        option.where.CategoryId = CategoryId
      }

      const eventsData = await Event.findAll(option)

      return eventsData
    }
  }
  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide title for your event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide title for your event' 
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide a description for your event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide a description for your event' 
        },
      }
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide a date for your event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide a date for your event' 
        },
        isAfterToday(value) {
          if(new Date(value) < new Date()) {
            throw new Error('Minimum event Date is today')
          }
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide the location of the event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide the location of the event' 
        },
      }
    },
    OrganizerId: DataTypes.INTEGER,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please pick a category of the event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please pick a category of the event' 
        },
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide an image of the event' 
        },
        notEmpty: {
          args: true,
          msg: 'Please provide an image of the event' 
        },
      }
    },
    capacity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};