import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import GroceryItem from '../models/GroceryItem';
import { Op } from 'sequelize';
import User from '../models/User';
let jwttoken = '$2a$10$Ip1YRHZRdcztUN5BJraiyex2xCQBffGK1pakHzPNxUwmZXzxvejZG'
const jwt = require('jsonwebtoken');

const addUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existingUser = await User.findOne({
          where: {
            email,
          },
        });
    
        if (existingUser) {
          res.status(409).json({ error: 'User with this email already exists' });
        } else {
          const newUser = await User.create({
            name,
            email,
            password: hashedPassword
          });
    
          res.status(201).json(newUser);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const data = req.body;

    try {
        const user = await User.findOne({where : {id: userId}});
        if (user) {
            if(data.hasOwnProperty('name')){
                user.name = data.name
            }
            if(data.hasOwnProperty('password')){
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(data.password, salt);
                user.password = hashedPassword
            }
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const deletedCount = await User.destroy({ where: { id: userId } });
  
      if (deletedCount > 0) {
        res.status(204).send({ msg: 'User deleted' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};


const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (isPasswordValid) {
          
          const token = jwt.sign({ userId: user.id }, jwttoken, { expiresIn: '1h' });
          return res.status(200).json({ user, token });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};

export default {addUser,updateUser, getAllUser, deleteUser, loginUser };
