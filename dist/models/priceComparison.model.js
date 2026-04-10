"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const user_model_1 = __importDefault(require("./user.model"));
const platform_model_1 = __importDefault(require("./platform.model"));
class PriceComparison extends sequelize_1.Model {
}
PriceComparison.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    compare_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    platformId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'price_comparisons',
    timestamps: true,
});
PriceComparison.belongsTo(user_model_1.default, { foreignKey: 'userId' });
user_model_1.default.hasMany(PriceComparison, { foreignKey: 'userId' });
PriceComparison.belongsTo(platform_model_1.default, { foreignKey: 'platformId' });
platform_model_1.default.hasMany(PriceComparison, { foreignKey: 'platformId' });
exports.default = PriceComparison;
