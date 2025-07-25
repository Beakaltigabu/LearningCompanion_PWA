import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserPreference extends Model {
    static associate(models) {
      // User preferences belong to a user
      UserPreference.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  UserPreference.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'light',
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
    notifications: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    aiSettings: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'UserPreference',
  });

  return UserPreference;
};
