import { Request, Response } from 'express';
import GroceryInventory from '../models/GroceryInventory';
import moment from 'moment';
import GroceryItem from '../models/GroceryItem';
import { sequelize } from '../config/database';
import UserCart from '../models/UserCart';

const addGroceryInventory = async (req: Request, res: Response) => {
  try {
    const { groceryItemId, quantity } = req.body;
    const existingRecord = await GroceryInventory.findOne({
    where: {
        groceryItemId,
    },
    });
    if (existingRecord) {
        await existingRecord.update({
          quantity: Number(existingRecord.quantity) + Number(quantity),
          date: moment(new Date()).format('YYYY-MM-DD'), 
        });
  
        res.status(200).json(existingRecord);
      } else {
        const newInventoryItem = await GroceryInventory.create({
        groceryItemId,
        quantity,
        date: moment(new Date()).format('YYYY-MM-DD'),
        });
        res.status(201).json(newInventoryItem);
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const deleteGroceryInventory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      
      const inventoryToDelete = await GroceryInventory.findOne({where: {id:id}});
  
      if (!inventoryToDelete) {
        return res.status(404).json({ error: 'Grocery inventory entry not found' });
      }
  
      
      await inventoryToDelete.destroy();
  
      res.status(200).json({ message: 'Grocery inventory entry deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
GroceryItem.hasOne(GroceryInventory, { foreignKey: 'groceryItemId' });
GroceryInventory.belongsTo(GroceryItem, { foreignKey: 'groceryItemId' });


const bookMultipleGroceries = async (req: Request, res: Response) => {
    const user = { id: 1 };
    const bookedGroceries = req.body;
    const t = await sequelize.transaction();
  
    try {
        let msgproceedArr:any = []
        let msgnotfoundArr:any = []
        let noQuantity:any = []
      for (const { groceryItemId, quantity } of bookedGroceries) {
        const groceryItem = await GroceryItem.findOne({
            where: { id: groceryItemId },
            include: [GroceryInventory],
            transaction: t,
            });
        const groceryInventory = await GroceryInventory.findOne({where:{groceryItemId}});
        if (!groceryItem) {
            msgnotfoundArr.push(groceryItemId)
        }
        if(groceryInventory && Number(groceryInventory.quantity) > Number(quantity) ){
            
    
            if (groceryItem) {
                await UserCart.create(
                {
                    quantity,
                    groceryItemId,
                    date: new Date(),
                    userId: user.id
                },
                { transaction: t }
                );
        
                await groceryItem?.GroceryInventory.decrement('quantity', {
                by: quantity,
                transaction: t,
                });
        
                await t.commit();
        
                msgproceedArr.push(groceryItem?.name)
            }
        }else{
            if (groceryItem) {
                noQuantity.push(groceryItem?.name)
            }
        }
     }
     let msg:any = []
     if(msgproceedArr.length > 0){
        msg.push(`${msgproceedArr.join(', ')} added to cart.`)
     }
     if(noQuantity.length > 0){
        msg.push(`${noQuantity.join(', ')} no quantity available.`)
     }
     if(msgnotfoundArr.length > 0){
        msg.push(`${msgnotfoundArr.join(', ')} id not found.`)
     }
     res.status(200).json({ msg: msg.join(' ') });
    } catch (error: any) {
      await t.rollback();
      console.error('Transaction rolled back:', error.message);
      res.status(500).json({ error: 'Failed to book groceries' });
    }
};
  

export default {addGroceryInventory, deleteGroceryInventory, bookMultipleGroceries}