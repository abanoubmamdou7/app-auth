import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

// Load environment variables
// In Vercel, environment variables are automatically available via process.env
// Only load .env file if it exists (for local development)
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch (error) {
  // Ignore if .env file doesn't exist (normal in Vercel)
}

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please configure it in Vercel environment variables.');
}

// Cache the NestJS app instance to avoid re-initialization on each request
let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const logger = new Logger('VercelServerless');
  const expressApp = express();
  
  // Add body parsers for JSON and URL-encoded data
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Enable cookie parser
  app.use(cookieParser());

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS - Allow all origins
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'X-Tenant-Id',
      'X-Tenant-Domain',
      'X-Session-ID',
      'X-Admin-API-Key',
      'idempotency-key',
      'Idempotency-Key',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Initialize the app (but don't call listen)
  await app.init();

  logger.log('✅ NestJS app initialized for Vercel serverless');
  cachedApp = expressApp;

  return expressApp;
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  try {
    const app = await createApp();
    // Forward the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

