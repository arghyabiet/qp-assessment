import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import GroceryInventory from './GroceryInventory';

class UserCart extends Model {
  public id!: number;
  public userId!: number;
  public quantity!: number;
  public groceryItemId!: number;
  public date!: Date;
}

UserCart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groceryItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    modelName: 'UserCart',
  }
);

UserCart.hasMany(GroceryInventory, { foreignKey: 'groceryItemId' });

export default UserCart;
