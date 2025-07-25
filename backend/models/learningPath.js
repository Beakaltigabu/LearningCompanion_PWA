import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class LearningPath extends Model {
    static associate(models) {
      // Learning path belongs to subject and grade level
      LearningPath.belongsTo(models.Subject, { foreignKey: 'subjectId' });
      LearningPath.belongsTo(models.GradeLevel, { foreignKey: 'gradeLevelId' });

      // Learning path has many lessons
      LearningPath.hasMany(models.Lesson, { foreignKey: 'learningPathId' });
    }
  }

  LearningPath.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gradeLevelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: DataTypes.STRING,
    estimatedDuration: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'LearningPath',
  });

  return LearningPath;
};
