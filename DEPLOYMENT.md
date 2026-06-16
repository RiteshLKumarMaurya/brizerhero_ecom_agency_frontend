# BrizerHero Frontend — Deployment Guide

## Option A: Vercel (Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: BrizerHero frontend"
git remote add origin https://github.com/your-org/brizerhero-frontend.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root directory: `/` (default)
5. Build command: `npm run build` (default)
6. Output directory: `.next` (default)

### 3. Set Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

```
NEXT_PUBLIC_API_URL              = https://api.briizerhero.com
NEXT_PUBLIC_SITE_URL             = https://brizerhero.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID     = your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_CDN_URL              = https://cdn.brizerhero.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = (optional)
```

### 4. Configure Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add `brizerhero.com` and `www.brizerhero.com`
3. Update DNS at your registrar:
   - `A` record: `76.76.19.61` (Vercel)
   - `CNAME` for `www`: `cname.vercel-dns.com`

### 5. Google OAuth — Update Origins

Go to Google Cloud Console → Your OAuth Client → Authorized JavaScript origins:
- Add `https://brizerhero.com`
- Add `https://www.brizerhero.com`

---

## Option B: VPS / Self-hosted (Ubuntu 22.04)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 process manager
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/www/brizerhero
sudo chown $USER:$USER /var/www/brizerhero

# Clone your repo (or upload files via rsync/scp)
git clone https://github.com/your-org/brizerhero-frontend.git /var/www/brizerhero
cd /var/www/brizerhero

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
nano .env.local  # Fill in your production values

# Build
npm run build
```

### 3. PM2 Process Manager

```bash
# Create PM2 ecosystem config
cat > /var/www/brizerhero/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'brizerhero-frontend',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/brizerhero',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '/var/log/pm2/brizerhero-err.log',
    out_file: '/var/log/pm2/brizerhero-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the printed command to enable auto-start
```

### 4. Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/brizerhero
```

Paste this config:

```nginx
server {
    listen 80;
    server_name brizerhero.com www.brizerhero.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Static assets - long cache
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/brizerhero /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL with Let's Encrypt
sudo certbot --nginx -d brizerhero.com -d www.brizerhero.com
```

### 5. CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/brizerhero
            git pull origin main
            npm install
            npm run build
            pm2 reload brizerhero-frontend
```

---

## Performance Checklist

- [ ] Enable Gzip/Brotli compression in Nginx
- [ ] Set `Cache-Control` headers for static assets
- [ ] Configure CDN (Cloudflare recommended) in front of Nginx
- [ ] Set `NEXT_PUBLIC_CDN_URL` to your media CDN
- [ ] Enable Cloudflare caching for static assets
- [ ] Monitor with PM2: `pm2 monit`
- [ ] Set up log rotation: `pm2 install pm2-logrotate`

## Security Checklist

- [ ] Keep `.env.local` out of git (`.gitignore` already set)
- [ ] Use HTTPS only (certbot handles this)
- [ ] Set `HSTS` header in Nginx
- [ ] Keep Node.js and npm updated
- [ ] Rotate JWT secrets periodically
- [ ] Review Google OAuth authorized origins after domain changes
