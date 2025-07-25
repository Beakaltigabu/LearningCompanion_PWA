import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

async function main() {
  // Now that env vars are loaded, dynamically import modules that need them
  // Await dbPromise to get the initialized db object
  const dbPromiseModule = await import('./models/index.js');
  const db = await dbPromiseModule.default;

  const app = express();

  // Middlewares
  app.use(express.json());

  // Comprehensive CORS configuration
  const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  // API Routes - use the centralized router
  app.use('/api', apiRoutes);

  const PORT = process.env.PORT || 3001;

  app.get('/', (req, res) => {
    res.send('Learning Companion API is running!');
  });

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('FATAL ERROR: DATABASE_URL is not defined. Please check your .env file.');
    }

    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with database
    await db.sequelize.sync({ alter: false });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
