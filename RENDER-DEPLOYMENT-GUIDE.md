# AutoFlow Backend - Render Deployment Guide

## Production Deployment on Render

This guide explains how to deploy the AutoFlow backend to Render with proper configuration for production.

## Prerequisites

1. A Render account (https://render.com)
2. A Supabase PostgreSQL database
3. Environment variables properly configured
4. Backend code pushed to GitHub

## Step 1: Database Setup (Supabase)

Your Supabase PostgreSQL connection string:
```
DATABASE_URL=postgresql://postgres.sbhjxlhsbjfagbmdpnqc:rozismail786@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

**Verify the connection:**
- Test in local development first
- Run `npm run prisma:migrate` to apply schema
- Ensure all tables are created

## Step 2: Generate JWT Secret

Generate a secure JWT secret (minimum 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
a7f9e2c4d1b6f3a8e5c9d2b7f4a1e6c3b8d5f2a9e4c7b1d8f3a6c9e2b5f8a1
```

Save this securely - you'll need it for Render configuration.

## Step 3: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the details:
   - **Name:** autoflow-backend
   - **Root Directory:** `backend/`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build && npm run prisma:generate`
   - **Start Command:** `node dist/main`
   - **Region:** Select based on your location
   - **Plan:** Choose based on needs (Starter/Pro)

## Step 4: Environment Variables

In Render Dashboard, add environment variables:

### **CRITICAL Variables** (Must be set)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres.sbhjxlhsbjfagbmdpnqc:rozismail786@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-generated-32-char-secret-here
```

### **Additional Variables**
```
FRONTEND_URL=https://autoflow.vercel.app
APP_URL=https://autoflow-backend.onrender.com
LOG_LEVEL=log
```

### **Optional Third-party APIs**
```
OPENAI_API_KEY=your-api-key
GEMINI_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

## Step 5: Build and Deploy

1. Render will automatically trigger a build when you connect
2. Monitor the deploy log for any errors
3. Check for common issues:
   - ❌ `DATABASE_URL not defined` → Add DATABASE_URL environment variable
   - ❌ `JWT_SECRET not defined` → Add JWT_SECRET environment variable
   - ❌ `Connection refused` → Check Supabase DATABASE_URL and allow Render IP
   - ❌ `Port already in use` → Render auto-manages ports, should be fine

## Step 6: Verify Deployment

Once deployed, test these endpoints:

### Health Check
```bash
curl https://autoflow-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AutoFlow API",
  "timestamp": "2024-05-23T10:30:45.123Z",
  "uptime": 125.456
}
```

### Root Route
```bash
curl https://autoflow-backend.onrender.com/
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-23T10:30:45.123Z"
}
```

## Step 7: Test Authentication

### Register a new user
```bash
curl -X POST https://autoflow-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST https://autoflow-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "user-id",
    "email": "test@example.com",
    "name": "Test User"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "hex-token-string"
}
```

## Step 8: Configure Frontend (Vercel)

Update your frontend `.env` to point to Render backend:

```env
REACT_APP_API_URL=https://autoflow-backend.onrender.com
NEXT_PUBLIC_API_URL=https://autoflow-backend.onrender.com
```

## Troubleshooting

### Error: 500 Internal Server Error on /auth/login

**Check logs in Render dashboard:**
1. Go to your service
2. Click "Logs" tab
3. Look for error messages

**Common causes:**
- ❌ DATABASE_URL not set or incorrect
- ❌ JWT_SECRET not set or too short
- ❌ Database connection timeout
- ❌ Prisma schema mismatch

**Solution:**
1. Verify all environment variables are set
2. Test database connection locally
3. Check Supabase connection pool settings
4. Review Prisma schema matches database

### Error: CORS Issues from Vercel

If frontend gets CORS error, verify:

1. Frontend URL is in CORS whitelist (check main.ts)
2. Add to allowed origins if needed:
```typescript
const allowedOrigins = [
  'https://autoflow.vercel.app',
  'https://autoflow-frontend.vercel.app',
  'https://your-custom-domain.com'
];
```

### Database Connection Timeout

**Solutions:**
1. Check Render service is in same region as Supabase
2. Verify `DATABASE_URL` connection string
3. Check Supabase database is not paused
4. Increase connection pool timeout in Prisma:

```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Prisma Migration Issues

If migrations fail on deploy:

1. Run migrations locally first:
```bash
npm run prisma:migrate
```

2. Or manually with Render shell access:
```bash
npx prisma migrate deploy
```

## Monitoring

### View Real-time Logs
```bash
# Render CLI
render logs -s autoflow-backend
```

### Check Application Health
- Navigate to `https://autoflow-backend.onrender.com/health`
- Should return 200 OK with status: "ok"

### Monitor Database
- Visit Supabase dashboard
- Check connection count
- Review query logs
- Monitor storage usage

## Common Production Settings

### Build Optimization
- Enable minification in tsconfig.json
- Remove console.logs in production code
- Use environment-based logging

### Performance
- Set `NODE_ENV=production`
- Enable compression middleware (already done)
- Use connection pooling for database
- Implement rate limiting (already configured: 100 requests/60s)

### Security
- Never commit `.env` files
- Use Render's environment variable encryption
- Enable HTTPS (automatic on Render)
- Keep dependencies updated

## Scaling Tips

1. **High Traffic:**
   - Upgrade to Pro plan
   - Increase database connection pool
   - Implement Redis caching

2. **Database Load:**
   - Use read replicas if available
   - Optimize Prisma queries
   - Add indexes for frequently queried fields

3. **Cold Starts:**
   - Keep service warm with periodic pings
   - Consider Premium plan on Render

## Support & Documentation

- Render Docs: https://render.com/docs
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Test all auth endpoints
3. ✅ Configure frontend to use backend URL
4. ✅ Set up monitoring/alerts
5. ✅ Document any custom configurations

---

**Last Updated:** 2024-05-23
**Backend Version:** 1.0.0
**Status:** Production Ready
