'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ledgers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      ledgerRef: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      walletId: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: "Wallets",
          key: "walletId"
        }
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("debit", "credit")
      },
      balanceAfter: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ledgers');
  }
};