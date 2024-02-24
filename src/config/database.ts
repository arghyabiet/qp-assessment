import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('qp_grocery', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  },
});

export { sequelize };
