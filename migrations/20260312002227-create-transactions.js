'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      transactionRef: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      senderWalletId: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: "Wallets",
          key: "walletId"
        }
      },
      receiverWalletId: {
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
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending"
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
    await queryInterface.dropTable('Transactions');
  }
};