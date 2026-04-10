"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Import all models
const product_model_1 = __importDefault(require("./models/product.model"));
const platform_model_1 = __importDefault(require("./models/platform.model"));
const platformListing_model_1 = __importDefault(require("./models/platformListing.model"));
const restaurant_model_1 = require("./models/restaurant.model");
const user_model_1 = __importDefault(require("./models/user.model"));
const order_model_1 = require("./models/order.model");
const favorite_model_1 = __importDefault(require("./models/favorite.model"));
const rating_model_1 = __importDefault(require("./models/rating.model"));
const notification_model_1 = __importDefault(require("./models/notification.model"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Connect to Database
        yield (0, db_1.connectDatabase)();
        // 2. Setup Associations
        console.log('⚙️  Setting up model associations...');
        // PlatformListing associations (already defined in model)
        // But we ensure Product has the association
        product_model_1.default.hasMany(platformListing_model_1.default, { foreignKey: 'productId' });
        platformListing_model_1.default.belongsTo(product_model_1.default, { foreignKey: 'productId' });
        platform_model_1.default.hasMany(platformListing_model_1.default, { foreignKey: 'platformId' });
        platformListing_model_1.default.belongsTo(platform_model_1.default, { foreignKey: 'platformId' });
        // Restaurant & Product relation
        restaurant_model_1.Restaurant.hasMany(product_model_1.default, { foreignKey: 'restaurantId' });
        product_model_1.default.belongsTo(restaurant_model_1.Restaurant, { foreignKey: 'restaurantId' });
        // User relations
        user_model_1.default.hasMany(order_model_1.Order, { foreignKey: 'userId' });
        order_model_1.Order.belongsTo(user_model_1.default, { foreignKey: 'userId' });
        user_model_1.default.hasMany(favorite_model_1.default, { foreignKey: 'userId' });
        favorite_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'userId' });
        user_model_1.default.hasMany(rating_model_1.default, { foreignKey: 'userId' });
        rating_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'userId' });
        user_model_1.default.hasMany(notification_model_1.default, { foreignKey: 'userId' });
        notification_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'userId' });
        // Order associations
        order_model_1.Order.belongsTo(product_model_1.default, { foreignKey: 'productId' });
        order_model_1.Order.belongsTo(platform_model_1.default, { foreignKey: 'platformId' });
        order_model_1.Order.belongsTo(restaurant_model_1.Restaurant, { foreignKey: 'restaurantId' });
        order_model_1.Order.hasMany(rating_model_1.default, { foreignKey: 'orderId' });
        rating_model_1.default.belongsTo(order_model_1.Order, { foreignKey: 'orderId' });
        // Favorite associations
        favorite_model_1.default.belongsTo(product_model_1.default, { foreignKey: 'productId' });
        favorite_model_1.default.belongsTo(platform_model_1.default, { foreignKey: 'platformId' });
        // Rating associations
        rating_model_1.default.belongsTo(product_model_1.default, { foreignKey: 'productId' });
        rating_model_1.default.belongsTo(platform_model_1.default, { foreignKey: 'platformId' });
        rating_model_1.default.belongsTo(restaurant_model_1.Restaurant, { foreignKey: 'restaurantId' });
        // Notification associations
        notification_model_1.default.belongsTo(order_model_1.Order, { foreignKey: 'orderId' });
        // 3. Sync Tables
        // Using alter: false to avoid schema conflicts with existing database
        yield db_1.sequelize.sync({ alter: false });
        console.log('✅ Database synchronized');
        // 4. Start Express
        const PORT = process.env.PORT || 5000;
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📍 API Base: http://localhost:${PORT}/api`);
        });
    }
    catch (err) {
        console.error('Failed to start:', err);
        process.exit(1);
    }
});
start();
