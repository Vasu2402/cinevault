const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodOrderItem = sequelize.define('FoodOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  foodOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'food_orders', key: 'id' },
  },
  foodItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'food_items', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  lineTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'food_order_items',
  timestamps: true,
});

module.exports = FoodOrderItem;
