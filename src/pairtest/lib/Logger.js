import winston from 'winston';
import fs from 'fs';
import path from 'path';

const configPath = path.resolve(process.cwd(), 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const isDev = process.env.NODE_ENV === 'development';
const loggingEnabled = config.logging.enabled && (!config.logging.devOnly || isDev);

export const logger = winston.createLogger({
  level: loggingEnabled ? 'info' : 'silent',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ silent: !loggingEnabled })
  ]
}); 