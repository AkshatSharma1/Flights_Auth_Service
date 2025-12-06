'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/server-config');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Many-to-Many relationship with Role
      this.belongsToMany(models.Role, {
        through: "user_roles",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50], // Password length validation
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  // 🔒 SECURITY HOOK: Hash password before creating
  User.beforeCreate(async (user) => {
    const encryptedPassword = await bcrypt.hash(user.password, +SALT_ROUNDS);
    user.password = encryptedPassword;
  });

  return User;
};