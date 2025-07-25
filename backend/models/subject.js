import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      // A subject has many learning paths
      Subject.hasMany(models.LearningPath, { foreignKey: 'subjectId' });
    }
  }

  Subject.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    iconUrl: DataTypes.STRING,
    color: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Subject',
  });

  return Subject;
};
