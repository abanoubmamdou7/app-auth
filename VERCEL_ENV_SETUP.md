# Vercel Environment Variables Setup

## Required Environment Variables

To deploy the `app-auth` service on Vercel, you need to configure the following environment variables in your Vercel project settings:

### Database Configuration

1. **DATABASE_URL** (Required)
   - Format: `mysql://username:password@host:port/database`
   - Example: `mysql://user:password@209.42.23.68:3306/dbname`
   - **Important**: Make sure your database server allows connections from Vercel's IP addresses

### Authentication Configuration

2. **JWT_SECRET** (Required)
   - A secret key for JWT token signing
   - Should be a long, random string
   - Example: `your-super-secret-jwt-key-here`

3. **JWT_EXPIRATION** (Optional)
   - JWT token expiration time
   - Default: `7d` (7 days)

### Other Environment Variables

Add any other environment variables that your application requires (check your `.env` file for reference).

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select which environments to apply to (Production, Preview, Development)
4. Click **Save**

## Database Connection Issues

If you're getting database connection errors:

### 1. Check Database Firewall Settings

Your database server at `209.42.23.68:3306` must allow connections from Vercel's IP addresses. Vercel uses dynamic IP addresses, so you may need to:

- Allow all IPs (not recommended for production)
- Use a database proxy service (recommended)
- Use Vercel's database integration if available

### 2. Verify DATABASE_URL Format

Make sure your `DATABASE_URL` is correctly formatted:
```
mysql://username:password@209.42.23.68:3306/database_name
```

### 3. Test Database Connection

You can test the connection using:
```bash
mysql -h 209.42.23.68 -P 3306 -u username -p database_name
```

### 4. Use Connection Pooling

For better performance and reliability, consider using a connection pooler like:
- **Prisma Connection Pooling**: Already configured if using Prisma
- **PgBouncer** (for PostgreSQL)
- **ProxySQL** (for MySQL)

## Recommended Setup for Production

1. **Use a managed database service** that provides:
   - Built-in connection pooling
   - Automatic backups
   - Monitoring and alerts
   - IP allowlisting

2. **Use environment-specific variables**:
   - Different `DATABASE_URL` for production and preview
   - Different `JWT_SECRET` for each environment

3. **Enable Vercel's database integration** if available for your database type

## Troubleshooting

### Error: "Can't reach database server"

**Possible causes:**
- Database server is not running
- Firewall is blocking Vercel's IP addresses
- `DATABASE_URL` is incorrect or not set
- Database server is only accessible from local network

**Solutions:**
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check database server firewall rules
3. Ensure database server is publicly accessible (or use a proxy)
4. Test connection from a different network

### Error: "Access denied for user"

**Possible causes:**
- Incorrect username or password in `DATABASE_URL`
- User doesn't have permission to access the database

**Solutions:**
1. Verify credentials in `DATABASE_URL`
2. Check database user permissions
3. Ensure user can connect from remote hosts

