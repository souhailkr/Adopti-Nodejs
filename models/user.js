'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    photo: DataTypes.STRING,
    num_tel: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    // associations can be defined her



  };
  return User;
};