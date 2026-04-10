import dotenv from "dotenv";
dotenv.config();
import app from './app';
import { connectDatabase, sequelize } from './config/db';

// Import all models
import Product from './models/product.model';
import Platform from './models/platform.model';
import PlatformListing from './models/platformListing.model';
import { Restaurant } from './models/restaurant.model';
import User from './models/user.model';
import { Order } from './models/order.model';
import Favorite from './models/favorite.model';
import Rating from './models/rating.model';
import Notification from './models/notification.model';

const start = async () => {
  try {
    // 1. Connect to Database
    await connectDatabase();
    
    // 2. Setup Associations
    console.log('⚙️  Setting up model associations...');
    
    // PlatformListing associations (already defined in model)
    // But we ensure Product has the association
    Product.hasMany(PlatformListing, { foreignKey: 'productId' });
    PlatformListing.belongsTo(Product, { foreignKey: 'productId' });
    
    Platform.hasMany(PlatformListing, { foreignKey: 'platformId' });
    PlatformListing.belongsTo(Platform, { foreignKey: 'platformId' });
    
    // Restaurant & Product relation
    Restaurant.hasMany(Product, { foreignKey: 'restaurantId' });
    Product.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

    // User relations
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Favorite, { foreignKey: 'userId' });
    Favorite.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Rating, { foreignKey: 'userId' });
    Rating.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Notification, { foreignKey: 'userId' });
    Notification.belongsTo(User, { foreignKey: 'userId' });

    // Order associations
    Order.belongsTo(Product, { foreignKey: 'productId' });
    Order.belongsTo(Platform, { foreignKey: 'platformId' });
    Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

    Order.hasMany(Rating, { foreignKey: 'orderId' });
    Rating.belongsTo(Order, { foreignKey: 'orderId' });

    // Favorite associations
    Favorite.belongsTo(Product, { foreignKey: 'productId' });
    Favorite.belongsTo(Platform, { foreignKey: 'platformId' });

    // Rating associations
    Rating.belongsTo(Product, { foreignKey: 'productId' });
    Rating.belongsTo(Platform, { foreignKey: 'platformId' });
    Rating.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

    // Notification associations
    Notification.belongsTo(Order, { foreignKey: 'orderId' });

    // 3. Sync Tables
    // Using alter: false to avoid schema conflicts with existing database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');
    
    // 4. Start Express
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 API Base: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};

start();
