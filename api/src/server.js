import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import './db/models/index.js';

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`MiniAula API escuchando en http://localhost:${env.port}`);
    });
  } catch {
    process.exit(1);
  }
}

bootstrap();