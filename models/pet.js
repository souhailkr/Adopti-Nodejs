'use strict';


module.exports = (sequelize, DataTypes) => {


  const Pet = sequelize.define('Pet', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    breed: DataTypes.STRING,
    size: DataTypes.STRING,
    sexe: DataTypes.STRING,
    photo: DataTypes.STRING,
    age: DataTypes.INTEGER,
    altitude : DataTypes.DOUBLE,
    longitude :  DataTypes.DOUBLE,
    UserId : DataTypes.INTEGER






  }, {});
  Pet.associate = function(models) {
      Pet.belongsTo(models.User);


  };
  return Pet;
};