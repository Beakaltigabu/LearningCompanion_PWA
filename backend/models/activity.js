import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      // Activity belongs to lesson
      Activity.belongsTo(models.Lesson, { foreignKey: 'lessonId' });
    }
  }

  Activity.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.JSON,
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: DataTypes.INTEGER,
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
  }, {
    sequelize,
    modelName: 'Activity',
  });

  return Activity;
};
