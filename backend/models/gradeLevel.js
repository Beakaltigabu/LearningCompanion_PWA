import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class GradeLevel extends Model {
    static associate(models) {
      // A grade level has many learning paths
      GradeLevel.hasMany(models.LearningPath, { foreignKey: 'gradeLevelId' });
    }
  }

  GradeLevel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'GradeLevel',
  });

  return GradeLevel;
};
