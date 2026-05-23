/**
 * FILE: app.config.ts
 * PURPOSE: Exposes application-level configuration values (environment, ports, URLs)
 * 
 * DEPENDENCIES:
 * - process.env
 * 
 * EXPORTS:
 * - AppConfig object with all application configuration
 */

export const AppConfig = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  logLevel: process.env.LOG_LEVEL || 'log',
});

