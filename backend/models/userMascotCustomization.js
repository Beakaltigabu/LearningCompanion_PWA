import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserMascotCustomization extends Model {
    static associate(models) {
      // A customization belongs to one user (child)
      UserMascotCustomization.belongsTo(models.User, {
        foreignKey: 'child_id',
        as: 'user',
      });

      // A customization belongs to one mascot
      UserMascotCustomization.belongsTo(models.Mascot, {
        foreignKey: 'mascot_id',
        as: 'mascot',
      });
    }
  }

  UserMascotCustomization.init({
    user_mascot_customization_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    child_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    mascot_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Mascots',
        key: 'mascot_id',
      },
    },
    custom_settings: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserMascotCustomization',
    timestamps: true,
  });

  return UserMascotCustomization;
};
