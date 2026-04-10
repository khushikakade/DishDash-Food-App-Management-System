"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const platform_routes_1 = __importDefault(require("./routes/platform.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const restaurant_routes_1 = __importDefault(require("./routes/restaurant.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const favorite_routes_1 = __importDefault(require("./routes/favorite.routes"));
const rating_routes_1 = __importDefault(require("./routes/rating.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const priceComparison_routes_1 = __importDefault(require("./routes/priceComparison.routes"));
const redirection_routes_1 = __importDefault(require("./routes/redirection.routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
app.get('/', (_req, res) => {
    res.json({
        message: 'DishDash backend is running',
        health: '/health',
        apiBase: '/api',
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/platforms', platform_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/restaurants', restaurant_routes_1.default);
app.use('/api/favorites', favorite_routes_1.default);
app.use('/api/ratings', rating_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/price-comparisons', priceComparison_routes_1.default);
app.use('/api/redirections', redirection_routes_1.default);
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use(error_middleware_1.default);
exports.default = app;
