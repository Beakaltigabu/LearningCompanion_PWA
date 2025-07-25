import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      // Lesson belongs to learning path
      Lesson.belongsTo(models.LearningPath, { foreignKey: 'learningPathId' });

      // Lesson has many activities
      Lesson.hasMany(models.Activity, { foreignKey: 'lessonId' });
    }
  }

  Lesson.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.TEXT,
    learningPathId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Lesson',
  });

  return Lesson;
};
