import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Mascot extends Model {
    static associate(models) {
      // A mascot can be selected by many users (children)
      Mascot.hasMany(models.User, {
        foreignKey: 'selected_mascot_id',
        as: 'selectedByUsers'
      });

      // A mascot can have many customizations
      Mascot.hasMany(models.UserMascotCustomization, {
        foreignKey: 'mascot_id',
        as: 'customizations'
      });
    }
  }

  Mascot.init({
    mascot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_am: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animation_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    unlock_cost_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unlock_achievement_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customizable_options: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Mascot',
    timestamps: true,
  });

  return Mascot;
};
