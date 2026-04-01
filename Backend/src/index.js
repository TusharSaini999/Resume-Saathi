import 'dotenv/config';
import connectDB from './config/db_config.js';
import app from './app.js';

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error.message);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
