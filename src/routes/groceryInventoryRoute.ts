import express from 'express';
import groceryInventoryController from '../controllers/groceryInventoryController';

const router = express.Router();

router.post('/add', groceryInventoryController.addGroceryInventory);
router.delete('/delete/:id', groceryInventoryController.deleteGroceryInventory);
router.post('/bookMultipleGroceries', groceryInventoryController.bookMultipleGroceries);

export default router;