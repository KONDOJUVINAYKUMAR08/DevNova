# AWS EC2 Deployment Guide – Lumière Jewellery Shop

## Prerequisites
- AWS Account with EC2 access
- Ubuntu 22.04+ AMI
- Security group with ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Minimum: t2.medium instance (2 vCPU, 4GB RAM)

## Step 1: Launch EC2 Instance

1. Launch an Ubuntu 22.04 t2.medium (or larger) instance
2. Configure Security Group inbound rules:
   - SSH (22) – Your IP
   - HTTP (80) – 0.0.0.0/0
   - HTTPS (443) – 0.0.0.0/0
3. Create/select a key pair

## Step 2: Connect & Install Dependencies

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Logout and reconnect for group to take effect
exit
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

## Step 3: Deploy Application

```bash
# Clone your repository (or transfer files)
git clone <your-repo-url> jewellery-shop
cd jewellery-shop

# Create .env file
cp .env .env.production
nano .env.production
# IMPORTANT: Change JWT_SECRET to a strong random value
# Update NEXT_PUBLIC_API_URL=http://<EC2_PUBLIC_IP>

# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Step 4: Verify Deployment

```bash
# Test health endpoints
curl http://localhost/health/user
curl http://localhost/health/product
curl http://localhost/health/rate

# Seed initial metal rates
curl -X POST http://localhost/api/rates/seed

# Open in browser: http://<EC2_PUBLIC_IP>
```

## Step 5: Domain & SSL (Optional)

```bash
# Install Certbot for free SSL
sudo apt install -y certbot python3-certbot-nginx

# Point your domain DNS A record to EC2 IP, then:
sudo certbot --nginx -d yourdomain.com
```

## Maintenance

```bash
# Restart services
docker compose restart

# View logs for specific service
docker compose logs -f user-service

# Update application
git pull
docker compose up -d --build

# Backup MongoDB data
docker compose exec user-db mongodump --out /data/backup

# Remove all containers + data
docker compose down -v
```

## Monitoring

```bash
# Container resource usage
docker stats

# Disk usage
df -h
docker system df
```
