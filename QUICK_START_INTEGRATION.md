# Quick Start: Backend + AI Service Integration

A step-by-step guide to run the complete Smart Job Service Platform with AI matching.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- Python 3.10+ (for AI service local development)
- MongoDB 7.0+ (if running without Docker)

## Quick Start (Docker)

### 1. Start All Services

```bash
cd /path/to/Job Service Platform

# Build and start all services
docker-compose up -d

# Watch logs
docker-compose logs -f
```

This starts:

- MongoDB (port 27017)
- AI Service (port 8000)
- Backend (port 5000)
- Frontend (port 3000)

### 2. Verify Services Are Healthy

```bash
# Check all containers
docker-compose ps

# Check AI service health
curl http://localhost:8000/api/v1/ai/health

# Check backend health
curl http://localhost:5000

# Check MongoDB
mongosh mongodb://root:root@localhost:27017
```

### 3. Test the Integration

#### Test 1: Create an Application (Triggers AI Matching)

```bash
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobId": "507f1f77bcf86cd799439011",
    "resumeUrl": "http://example.com/resume.pdf"
  }'
```

Response:

```json
{
    "success": true,
    "message": "Application submitted successfully",
    "application": {
        "_id": "...",
        "student": "...",
        "job": "...",
        "resumeUrl": "...",
        "aiScore": 82.41,
        "status": "applied",
        "createdAt": "..."
    }
}
```

#### Test 2: Get Applications Sorted by AI Score

```bash
curl http://localhost:5000/api/v1/jobs/507f1f77bcf86cd799439012/applications/sorted \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Test 3: View Logs

```bash
# Backend logs with AI service calls
docker-compose logs backend

# AI service logs
docker-compose logs ai-service

# MongoDB logs
docker-compose logs mongodb
```

## Local Development (Without Docker)

### 1. Start MongoDB

```bash
# Using Docker (without full compose)
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=root \
  mongo:7.0
```

### 2. Start AI Service

```bash
cd ai-layer

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start Backend

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Architecture Diagram

```
┌─────────────────────┐
│ Frontend (React)    │ (http://localhost:3000)
│ Port 3000           │
└──────────┬──────────┘
           │
┌──────────┴──────────┐
│ Backend (Node.js)   │ (http://localhost:5000)
│ Port 5000           │
│                     │
│ - API endpoints     │
│ - Orchestration     │
│ - Database access   │
└──────────┬──────────┘
    ┌──────┴──────┐
    ↓             ↓
┌─────────┐  ┌──────────────┐
│MongoDB  │  │ AI Service   │ (http://localhost:8000)
│Port     │  │ Port 8000    │
│27017    │  │              │
│         │  │ - Stateless  │
│- User   │  │ - Matching   │
│- Job    │  │ - Embeddings │
│- App    │  │ - No DB      │
│- Score  │  │   access     │
└─────────┘  └──────────────┘
```

## Common Issues

### Issue 1: "Connection refused: AI service"

**Cause**: AI service not running or port 8000 not exposed

**Fix**:

```bash
# Check if AI service is running
docker-compose ps ai-service

# Check logs
docker-compose logs ai-service

# Restart AI service
docker-compose restart ai-service
```

### Issue 2: "AI score is null in application"

**Cause**:

1. Resume content fetching not implemented (fetchResumeContent returns null)
2. AI service failed (but application created anyway - graceful degradation)

**Check logs**:

```bash
docker-compose logs backend | grep "AI matching"
```

### Issue 3: "Slow application creation"

**Cause**: AI service is slow or backend is waiting

**Solutions**:

1. Check AI service performance:

    ```bash
    docker-compose logs ai-service | grep "duration"
    ```

2. Verify async scoring (should not block):

    ```javascript
    // Should return immediately
    const app = await createApplication(...);
    // Score computed in background
    ```

3. Scale AI service:
    ```yaml
    # docker-compose.yml
    deploy:
        replicas: 3
    ```

### Issue 4: "MongoDB connection failed"

**Check MongoDB**:

```bash
# Test connection
mongosh mongodb://root:root@localhost:27017

# Check logs
docker-compose logs mongodb

# Ensure health check passes
docker-compose ps mongodb
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
LOG_LEVEL=INFO

# Database
MONGO_URI=mongodb://root:root@localhost:27017/job-service-portal

# AI Service
AI_SERVICE_URL=http://localhost:8000/api/v1/ai
AI_SERVICE_TIMEOUT=30000
AI_SERVICE_MAX_RETRIES=2
AI_SERVICE_RETRY_DELAY=1000
```

### AI Service (.env)

```env
# Server
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO

# Model
MODEL_NAME=all-MiniLM-L6-v2
MODEL_CACHE_DIR=./models
PRELOAD_MODELS_ON_STARTUP=true

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8080", "http://localhost:5000"]
```

## API Endpoints

### AI Service

- `POST /api/v1/ai/match` - Compute similarity score
- `GET /api/v1/ai/health` - Service health check
- `GET /api/v1/ai/models` - Model information

### Backend

- `POST /api/v1/applications` - Create application (triggers AI matching)
- `GET /api/v1/applications` - List applications (student)
- `GET /api/v1/jobs/:id/applications` - List job applications (recruiter)
- `GET /api/v1/jobs/:id/applications/sorted` - Sorted by AI score

## Debugging

### View logs with filtering

```bash
# AI service errors
docker-compose logs ai-service | grep ERROR

# Backend AI calls
docker-compose logs backend | grep "AI matching"

# Request tracing
docker-compose logs backend | grep "[request-id]"
```

### Manually test AI service

```bash
curl -X POST http://localhost:8000/api/v1/ai/match \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Python developer with 5 years experience",
    "jobDescription": "Seeking Python/Django backend engineer"
  }'
```

Response:

```json
{
    "similarityScore": 82.41
}
```

## Performance Targets

- Application creation: <5s (including AI scoring)
- AI matching endpoint: <50ms
- Database operations: <100ms
- Backend retry: 1s, 2s, 4s delays

## Next Steps

1. Implement resume content fetching (PDF/text extraction)
2. Add batch scoring for offline processing
3. Implement caching for repeated matches
4. Add recruiter dashboard with sorted applications
5. Real-time scoring with WebSockets

## Documentation

- [Backend + AI Integration Architecture](./BACKEND_AI_INTEGRATION.md)
- [AI Service Quick Start](./ai-layer/QUICK_START.md)
- [Logging Guide](./ai-layer/LOGGING_GUIDE.md)
- [Embedding Integration](./ai-layer/EMBEDDING_INTEGRATION_GUIDE.md)
