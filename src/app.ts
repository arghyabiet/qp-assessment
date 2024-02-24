// app.ts

import express from 'express';
import bodyParser from 'body-parser';
import groceryItemsRouter from './routes/groceryItemsRoute';
import groceryInventoryRouter from './routes/groceryInventoryRoute';
import userRoute from './routes/userRoute';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Use the groceryItemsRouter
app.use('/grocery-items', groceryItemsRouter);
app.use('/grocery-inventory', groceryInventoryRouter);
app.use('/user', userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
