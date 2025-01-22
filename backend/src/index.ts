import app from './app';
import 'dotenv/config'; 
import  db  from './db'; 
import { Pool } from 'pg';

const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');

  try {
    if (db instanceof Pool) {
      await db.end();
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
