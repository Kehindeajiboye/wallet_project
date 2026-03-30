'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ledgers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ledgers.init({
    ledgerRef: DataTypes.STRING,
    walletId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    type: DataTypes.ENUM("debit", "credit"),
    balanceAfter: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ledgers',
  });
  return Ledgers;
};