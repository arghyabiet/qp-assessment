import { Request, Response } from 'express';
import Joi from 'joi';
import GroceryItem from '../models/GroceryItem';
import { Op } from 'sequelize';

const addGroceryItem = async (req: Request, res: Response) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      
      const existingItem = await GroceryItem.findOne({
        where: { name: value.name },
      });
  
      if (existingItem) {
        return res.status(400).json({ error: 'Item with this name already exists' });
      }
  
      // Create a new grocery item
      const newItem = await GroceryItem.create({
        name: value.name,
        price: value.price,
      });
  
      return res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateGroceryItem = async (req: Request, res: Response) => {
console.log('innnnn')
try {
    const itemId = req.params.id;

    
    const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
    return res.status(400).json({ error: error.details[0].message });
    }

    
    const existingItem = await GroceryItem.findOne({
    where: {
        name: value.name,
        id: { [Op.not]: itemId },
    },
    });

    if (existingItem) {
    return res.status(400).json({ error: 'Item with this name already exists' });
    }

    
    const updatedItem = await GroceryItem.update(
    { name: value.name},
    { where: { id: itemId } }
    );

    return res.status(200).json({msg: 'Item updated successfully'});
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
}
};

const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await GroceryItem.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteItem = async (req: Request, res: Response) => {
try {
    const itemId = req.params.id;
    
    const itemToDelete = await GroceryItem.findOne({ where: { id: itemId } });

    if (!itemToDelete) {
    return res.status(404).json({ error: 'Item not found' });
    }
    
    await itemToDelete.destroy();

    res.status(200).json({ message: 'Item deleted successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};

export default {addGroceryItem,updateGroceryItem, getAllItems, deleteItem };
