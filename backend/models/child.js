import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.belongsTo(models.User, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
    }

    async checkPin(pin) {
      if (!this.pin) return false;
      return await bcrypt.compare(pin, this.pin);
    }
  }

  Child.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    grade_level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Don't hash if already hashed
        if (value && value.length === 4 && /^\d{4}$/.test(value)) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('pin', hash);
        } else {
          this.setDataValue('pin', value);
        }
      }
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
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    sequelize,
    modelName: 'Child',
    tableName: 'Children',
    timestamps: true,
  });

  return Child;
};
