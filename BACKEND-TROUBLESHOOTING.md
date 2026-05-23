# Backend Troubleshooting Guide - 500 Errors

## Quick Diagnosis

When you encounter a 500 Internal Server Error, follow this systematic approach:

### 1. Check Server Logs

**Render Dashboard:**
1. Go to your service: https://dashboard.render.com
2. Click on "autoflow-backend" service
3. Open "Logs" tab
4. Search for `❌` or `ERROR` keywords

**Local Development:**
```bash
npm run start:dev
```
Watch for error messages in terminal

## Common 500 Error Causes & Solutions

### ❌ "JWT_SECRET is not defined"

**Problem:** The `JWT_SECRET` environment variable is missing

**Error Log:**
```
❌ JWT_SECRET environment variable is not defined
```

**Fix:**

On Render:
1. Go to Environment → Add Variable
2. Key: `JWT_SECRET`
3. Value: Generate secure key → `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. Redeploy

On Local:
```bash
# Create .env file
echo "JWT_SECRET=your-generated-32-char-secret" >> backend/.env
npm run start:dev
```

---

### ❌ "DATABASE_URL is not defined"

**Problem:** The `DATABASE_URL` environment variable is missing

**Error Log:**
```
❌ DATABASE_URL is not defined in environment variables
```

**Fix:**

On Render:
1. Go to Environment → Add Variable
2. Key: `DATABASE_URL`
3. Value: `postgresql://postgres.sbhjxlhsbjfagbmdpnqc:rozismail786@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`
4. Redeploy

On Local:
```bash
# Create .env file
echo "DATABASE_URL=postgresql://postgres.sbhjxlhsbjfagbmdpnqc:rozismail786@aws-1-ap-south-1.pooler.supabase.com:5432/postgres" >> backend/.env
npm run start:dev
```

---

### ❌ "Failed to connect to database"

**Problem:** The backend cannot connect to Supabase PostgreSQL

**Error Log:**
```
❌ Failed to connect to database: ECONNREFUSED 127.0.0.1:5432
```

**Causes:**
- DATABASE_URL is incorrect
- Supabase database is paused
- Supabase connection pool is full
- Network connectivity issue (firewall, VPN)

**Fix:**

1. **Verify DATABASE_URL locally:**
```bash
# Test with psql
psql "postgresql://postgres.sbhjxlhsbjfagbmdpnqc:rozismail786@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

2. **Check Supabase Dashboard:**
   - Go to https://app.supabase.com
   - Select your project
   - Database → Session
   - Ensure database is not paused

3. **Reset Render service:**
   - Go to Render → Settings
   - Click "Restart service"

4. **Check Render region:**
   - Verify Render region is close to Supabase region (ap-south-1)

---

### ❌ "Email already in use" on first register

**Problem:** Database already has users with that email

**Error Log:**
```
"statusCode": 400,
"message": "Email already in use"
```

**Fix:**
- This is a 400 Bad Request, not a 500 error
- Use a different email address
- Or reset database and restart with fresh data

---

### ❌ "Invalid credentials" on login

**Problem:** User not found or password is incorrect

**Error Log:**
```
"statusCode": 401,
"message": "Invalid email or password"
```

**Causes:**
- User hasn't registered yet
- Password is incorrect
- Bcrypt comparison failed
- Database query error (would be 500)

**Fix:**
- Verify user exists in database (check Supabase)
- Ensure password is correct
- Check if user was created without password hash

---

### ❌ "Failed to register user. Please try again."

**Problem:** Database error during user creation

**Error Log (development):**
```
Register error: insert or update on table "User" violates foreign key constraint
```

**Likely Causes:**
- Referenced workspace/organization doesn't exist
- Database schema mismatch
- Transaction failed

**Fix:**

1. Check Prisma schema matches database:
```bash
npm run prisma:migrate
```

2. Review database tables exist:
```bash
# Render shell
npx prisma studio
```

3. Verify foreign key relationships

---

### ❌ "Failed to process login. Please try again."

**Problem:** Generic error during login - could be database, bcrypt, or JWT issue

**Error Log (development):**
```
Login error: P1000: Authentication failed against database server
```

**Diagnostic Steps:**

1. **Check Database Connection:**
```bash
curl https://autoflow-backend.onrender.com/health
```
Should return 200 OK

2. **Check Logs:**
- Look for specific error in logs
- Search for "Login error:" and read the full message

3. **Test with curl locally:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

---

### ❌ "Connection refused" Error

**Problem:** Backend can't reach database at all

**Error Log:**
```
ECONNREFUSED 127.0.0.1:5432
Connection timeout after 10000ms
```

**Common Causes:**
- Wrong DATABASE_URL
- Supabase database paused
- Network/firewall blocking
- Prisma connection pool exhausted

**Fix:**

1. **For Render Service:**
```bash
# Restart the service
# Go to Render → Settings → Restart service
```

2. **Check Supabase Connection Pool:**
   - Go to Supabase Dashboard → Database → Connection Pooling
   - Increase pool size if needed (default: 3)

3. **Add Render IP to Supabase Allowlist:**
   - Render public IPs are dynamic
   - Easiest: Allow all IPs (for development only!)
   - Better: Use Supabase SSL mode

---

### ❌ "CORS error from Vercel frontend"

**Problem:** Frontend gets CORS error when calling backend

**Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Root cause:** Frontend URL not in CORS allowlist

**Fix on Render:**

Update `main.ts` with correct URLs:
```typescript
const allowedOrigins = [
  'https://autoflow.vercel.app',
  'https://your-custom-domain.vercel.app'
];
```

Then redeploy.

**Alternative - Allow all origins (development only):**
```typescript
app.enableCors({
  origin: '*',  // NOT RECOMMENDED FOR PRODUCTION
});
```

---

### ❌ "Token generation error"

**Problem:** JWT token couldn't be created

**Error Log:**
```
Token generation error: Cannot read property 'sign' of undefined
```

**Causes:**
- JwtService not injected properly
- JWT_SECRET undefined in JwtModule
- JwtModule not imported in AuthModule

**Fix:**

1. Check AuthModule imports:
```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '15m' },
  }),
}),
```

2. Verify JWT_SECRET is set in environment

3. Check AuthService constructor:
```typescript
constructor(
  private readonly jwtService: JwtService,  // Must be injected
  private readonly prisma: PrismaService,
) {}
```

---

## Testing Error Scenarios

### Test 1: Health Check
```bash
curl https://autoflow-backend.onrender.com/
```
Expected: 200 OK with status info

### Test 2: Register
```bash
curl -X POST https://autoflow-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "debug-user@test.com",
    "password": "TestPassword123",
    "name": "Debug User"
  }'
```
Expected: 201 Created with tokens

### Test 3: Login
```bash
curl -X POST https://autoflow-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "debug-user@test.com",
    "password": "TestPassword123"
  }'
```
Expected: 200 OK with tokens

### Test 4: Invalid Login
```bash
curl -X POST https://autoflow-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@test.com",
    "password": "WrongPassword"
  }'
```
Expected: 401 Unauthorized

---

## Production Monitoring

### Enable Detailed Logging

Set environment variable:
```
LOG_LEVEL=debug
```

This will output detailed logs for troubleshooting.

### Monitor Database Connections

In Supabase Dashboard:
1. Database → Session
2. Check connection count
3. If too many idle connections, increase pool size or add timeout

### Monitor Error Rates

Track in Render:
1. Service → Metrics
2. Watch for spikes in error response status codes
3. Check CPU/Memory usage

---

## Escalation Steps

If you've tried all above and still getting 500 errors:

### 1. **Check Build Logs**
- Render → Events tab
- Look for build failures
- Check dependency installation errors

### 2. **Test Locally**
```bash
cd backend
npm install
npm run build
npm run start:prod
# Test: curl http://localhost:3001
```

### 3. **Check Render System Logs**
- May indicate out of memory, crash loops, etc.

### 4. **Verify Prisma Generation**
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. **Contact Support**
- Render Support: https://support.render.com
- Supabase Support: https://supabase.com/support
- Share:
  - Full error log (sanitized)
  - Environment variable names (not values)
  - Steps to reproduce

---

## Prevention Tips

✅ **Always:**
- Set NODE_ENV=production
- Use separate JWT_SECRET for production
- Never commit .env file
- Test in staging before production
- Monitor error logs daily

❌ **Never:**
- Use hardcoded secrets
- Allow all origins in CORS
- Log sensitive data
- Disable HTTPS
- Commit credentials to GitHub

---

**Last Updated:** 2024-05-23
**For Questions:** Check logs first, then escalate
