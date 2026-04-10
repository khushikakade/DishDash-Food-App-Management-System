import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import User from './user.model';
import Platform from './platform.model';

class PriceComparison extends Model {
  public id!: number;
  public compare_price!: number;
  public userId!: number;
  public platformId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PriceComparison.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    compare_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    platformId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'price_comparisons',
    timestamps: true,
  }
);

PriceComparison.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PriceComparison, { foreignKey: 'userId' });

PriceComparison.belongsTo(Platform, { foreignKey: 'platformId' });
Platform.hasMany(PriceComparison, { foreignKey: 'platformId' });

export default PriceComparison;
