import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import GroceryInventory from './GroceryInventory';

class GroceryItem extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
    GroceryInventory: any;
}

GroceryItem.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: 'GroceryItem',
  }
);

export default GroceryItem;
