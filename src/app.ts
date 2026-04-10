import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import platformRoutes from './routes/platform.routes';
import orderRoutes from './routes/order.routes';
import restaurantRoutes from './routes/restaurant.routes';
import authRoutes from './routes/auth.routes';
import favoriteRoutes from './routes/favorite.routes';
import ratingRoutes from './routes/rating.routes';
import notificationRoutes from './routes/notification.routes';
import priceComparisonRoutes from './routes/priceComparison.routes';
import redirectionRoutes from './routes/redirection.routes';

const app = express();

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/price-comparisons', priceComparisonRoutes);
app.use('/api/redirections', redirectionRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
