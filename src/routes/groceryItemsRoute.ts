import express from 'express';
import groceryItemsController from '../controllers/groceryItemsController';


const router = express.Router();

router.post('/add', groceryItemsController.addGroceryItem);
router.put('/update/:id', groceryItemsController.updateGroceryItem);
router.get('/all', groceryItemsController.getAllItems);
router.delete('/delete/:id', groceryItemsController.deleteItem);

export default router;
