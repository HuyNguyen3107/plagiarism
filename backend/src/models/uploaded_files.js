"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Uploaded_File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Uploaded_File.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
      },
      path: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Uploaded_File",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "uploaded_files",
    }
  );
  return Uploaded_File;
};
