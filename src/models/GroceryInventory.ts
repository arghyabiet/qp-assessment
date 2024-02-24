import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import GroceryItem from './GroceryItem';

class GroceryInventory extends Model {
  public id!: number;
  public quantity!: number;
  public date!: Date;
  public groceryItemId!: number;
}

GroceryInventory.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groceryItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'GroceryInventory',
  }
);


export default GroceryInventory;
