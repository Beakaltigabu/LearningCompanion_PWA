import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user (parent) can have many children
      User.hasMany(models.Child, {
        foreignKey: 'parent_id',
        as: 'children',
      });

      // A user (child) has one selected mascot
      User.belongsTo(models.Mascot, {
        foreignKey: 'selected_mascot_id',
        as: 'selectedMascot',
      });

      // A user (child) can have many mascot customizations
      User.hasMany(models.UserMascotCustomization, {
        foreignKey: 'child_id',
        as: 'mascotCustomizations',
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('parent', 'child'),
      allowNull: false,
      defaultValue: 'parent',
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    passkey_credentials: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    child_pin_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    child_pin_salt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    selected_mascot_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Mascots',
        key: 'mascot_id',
      },
    },
    theme_preference: {
      type: DataTypes.STRING,
      defaultValue: 'sunshine',
    },
    language_preference: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
    notification_preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ai_settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.child_pin_hash && user.role === 'child') {
          const salt = await bcrypt.genSalt(10);
          user.child_pin_hash = await bcrypt.hash(user.child_pin_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('child_pin_hash') && user.child_pin_hash && user.role === 'child') {
          const salt = await bcrypt.genSalt(10);
          user.child_pin_hash = await bcrypt.hash(user.child_pin_hash, salt);
        }
      },
    },
  });

  return User;
};
