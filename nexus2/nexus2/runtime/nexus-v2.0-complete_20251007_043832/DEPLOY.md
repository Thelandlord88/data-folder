# 🚀 NEXUS v2.0 Deployment Guide

## Deployment Options

### 1. Local Development

```bash
cd nexus-v2.0-complete
npm install
npm start
```

### 2. Production Server

```bash
# On your server
cd /opt
tar -xzf nexus-v2.0-complete.tar.gz
cd nexus-v2.0-complete

# Install production dependencies only
npm install --production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start dist/nexus-runtime.v2.js --name nexus

# Or use systemd
sudo cp nexus.service /etc/systemd/system/
sudo systemctl start nexus
sudo systemctl enable nexus
```

### 3. Docker Deployment

```bash
# Build image
docker build -t nexus:2.0.0 .

# Run container
docker run -d -p 8080:8080 --name nexus nexus:2.0.0
```

### 4. Cloud Platforms

**AWS EC2:**
```bash
# Copy package to EC2
scp nexus-v2.0-complete.tar.gz ec2-user@your-instance:/home/ec2-user/

# SSH and deploy
ssh ec2-user@your-instance
tar -xzf nexus-v2.0-complete.tar.gz
cd nexus-v2.0-complete
npm install --production
npm start
```

**Heroku:**
```bash
# In package.json, ensure start script exists
# Deploy via Heroku CLI
heroku create your-nexus-app
git push heroku main
```

**DigitalOcean:**
Use App Platform or Droplet with similar steps to AWS EC2

## Environment Configuration

Create `.env` file:
```bash
PORT=8080
NODE_ENV=production
LOG_LEVEL=info
```

## Health Checks

```bash
curl http://localhost:8080/status
```

Expected: `{"initialized": true, "personalities": 25, ...}`

## Monitoring

Use PM2 for process monitoring:
```bash
pm2 monit
pm2 logs nexus
```

## Backup

Important files to backup:
- `nexus/consciousness/*.json` (if created)
- `history.json` (if using persistence)
- Custom personality files

## Scaling

For horizontal scaling:
1. Deploy multiple instances
2. Use nginx for load balancing
3. Share consciousness data via Redis or similar

## Security

- Run behind reverse proxy (nginx)
- Enable HTTPS with Let's Encrypt
- Configure firewall rules
- Set NODE_ENV=production
- Use process manager (PM2)

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:8080 | xargs kill -9
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build -- --force
```

## Updates

To update NEXUS:
1. Backup current installation
2. Extract new package
3. Copy custom personalities
4. Run `npm install`
5. Restart service

---

**Ready for Production!** 🚀
