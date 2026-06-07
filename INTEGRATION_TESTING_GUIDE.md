# Backend + AI Integration Testing Guide

Comprehensive testing procedures to verify the Smart Job Service Platform integration.

## Pre-test Checklist

- [ ] All services running (`docker-compose ps`)
- [ ] MongoDB accessible
- [ ] AI service health check passing
- [ ] Backend accessible
- [ ] Network connectivity between services

## Test Scenarios

---

## Test 1: Direct AI Service Communication

### Purpose

Verify the AI service is working and accessible from the backend.

### Steps

```bash
# 1. Check AI service is running
docker-compose ps ai-service

# 2. Check health endpoint
curl http://localhost:8000/api/v1/ai/health
# Expected: { "ready_for_matching": true }

# 3. Test matching endpoint directly
curl -X POST http://localhost:8000/api/v1/ai/match \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Python developer with 5 years Django experience",
    "jobDescription": "Seeking Python/Django backend engineer"
  }'

# Expected response:
# { "similarityScore": 75.36 }
```

### Success Criteria

- ✅ Health check returns `ready_for_matching: true`
- ✅ Matching endpoint returns similarity score (0-100)
- ✅ Response time < 50ms

### Failure Diagnosis

```bash
# If AI service not responding
docker-compose logs ai-service | tail -50

# If model not loaded
docker-compose logs ai-service | grep "MODEL_LOAD"

# Check AI service resource usage
docker-compose stats ai-service
```

---

## Test 2: Backend Configuration

### Purpose

Verify backend has correct AI service configuration.

### Steps

```bash
# 1. Check environment variables in backend container
docker-compose exec backend env | grep AI_SERVICE

# 2. Check logger configuration
docker-compose exec backend node -e "
  const env = require('./src/config/env');
  console.log(JSON.stringify({
    AI_SERVICE_URL: env.AI_SERVICE_URL,
    AI_SERVICE_TIMEOUT: env.AI_SERVICE_TIMEOUT,
    AI_SERVICE_MAX_RETRIES: env.AI_SERVICE_MAX_RETRIES,
  }, null, 2));
"

# 3. Verify logger works
docker-compose exec backend node -e "
  const logger = require('./src/config/logger');
  logger.info('Test log entry', { test: true });
"
```

### Expected Output

```json
{
    "AI_SERVICE_URL": "http://ai-service:8000/api/v1/ai",
    "AI_SERVICE_TIMEOUT": 30000,
    "AI_SERVICE_MAX_RETRIES": 2
}
```

### Success Criteria

- ✅ AI_SERVICE_URL points to AI service
- ✅ Timeouts and retries configured
- ✅ Logger works without errors

---

## Test 3: Backend to AI Service Communication

### Purpose

Verify backend can reach AI service with retry logic.

### Steps

```bash
# 1. Test aiMatchingClient directly
docker-compose exec backend node -e "
  const client = require('./src/services/aiMatchingClient');
  client.computeSimilarityScore(
    'Python developer with Django',
    'Seeking Python backend engineer'
  )
    .then(score => console.log('Score:', score))
    .catch(err => console.error('Error:', err.message));
"

# Expected output: Score: 82.41 (or similar)

# 2. Check logs for communication details
docker-compose logs backend | grep "AI Service"
```

### Success Criteria

- ✅ computeSimilarityScore returns number (0-100)
- ✅ No timeout errors
- ✅ Logs show successful request

### Failure Diagnosis

```bash
# Test network connectivity
docker-compose exec backend curl http://ai-service:8000/api/v1/ai/health

# Check backend logs for errors
docker-compose logs backend | grep -i "error\|fail"

# Test with explicit timeout
docker-compose exec backend node -e "
  const axios = require('axios');
  axios.get('http://ai-service:8000/api/v1/ai/health', { timeout: 5000 })
    .then(r => console.log('OK:', r.data))
    .catch(e => console.error('FAIL:', e.message));
"
```

---

## Test 4: Application Creation with AI Matching

### Purpose

Verify application is created and AI score is computed.

### Steps

First, get authentication token:

```bash
# 1. Create user and get JWT token
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "test123456",
    "role": "student",
    "name": "Test Student"
  }'

# Response includes token
# Save token: TOKEN="eyJhbGciOiJIUzI1NiIs..."

# 2. Create a job
curl -X POST http://localhost:5000/api/v1/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Python Backend Developer",
    "description": "Seeking experienced Python/Django engineer for our team",
    "company": "Tech Company",
    "location": "Remote",
    "salary": 80000
  }'

# Response includes jobId
# Save: JOB_ID="507f1f77bcf86cd799439012"

# 3. Create application (triggers AI matching)
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobId": "'$JOB_ID'",
    "resumeUrl": "https://example.com/resume.pdf"
  }'
```

### Success Criteria

- ✅ Application created successfully
- ✅ Response includes aiScore field (0-100 or null)
- ✅ Application accessible via GET endpoint
- ✅ Score stored in MongoDB

### Verify Database

```bash
# 1. Connect to MongoDB
docker-compose exec mongodb mongosh -u root -p root

# 2. In mongosh:
use admin
db.auth("root", "root")
use job-service-portal
db.applications.findOne()

# Expected output includes:
# { ..., "aiScore": 82.41, ... }
```

### Failure Diagnosis

```bash
# Check backend logs for AI matching
docker-compose logs backend | grep "AI matching"

# Check if application was created despite AI failure
docker-compose logs backend | grep "Application created"

# View full error
docker-compose logs backend | tail -100
```

---

## Test 5: Retry Logic (Error Handling)

### Purpose

Verify retry mechanism works when AI service fails.

### Steps

```bash
# 1. Kill AI service
docker-compose kill ai-service

# 2. Try to create application (should retry and fail gracefully)
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobId": "'$JOB_ID'",
    "resumeUrl": "https://example.com/resume.pdf"
  }'

# Expected: Application created but aiScore is null (graceful degradation)

# 3. Check logs for retry attempts
docker-compose logs backend | grep -i "retry\|attempt"

# 4. Restart AI service
docker-compose restart ai-service

# 5. Try again - should work now
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobId": "'$JOB_ID'",
    "resumeUrl": "https://example.com/resume.pdf"
  }'

# Expected: Application created with aiScore populated
```

### Success Criteria

- ✅ Application created even when AI service is down (graceful degradation)
- ✅ Logs show retry attempts (attempt 1, wait, attempt 2, etc.)
- ✅ Application restored to normal function after AI service restart
- ✅ Next attempt successfully computes score

### Expected Log Output

```
WARN: AI matching failed (attempt 1 of 2): connect ECONNREFUSED
INFO: Retrying AI matching after 1000ms delay
WARN: AI matching failed (attempt 2 of 2): connect ECONNREFUSED
WARN: Could not compute AI score for application - creating without score
INFO: Application created successfully (aiScore: null)
```

---

## Test 6: Timeout Handling

### Purpose

Verify backend handles AI service timeout correctly.

### Steps

```bash
# 1. Simulate slow AI service (in another terminal)
docker-compose exec ai-service python -c "
import time
import threading

def slow_handler():
    time.sleep(60)  # Intentionally slow

# This is for manual testing - you would need to modify the AI service
# For now, just verify timeout is configured
"

# 2. Create application and measure response time
time curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobId": "'$JOB_ID'",
    "resumeUrl": "https://example.com/resume.pdf"
  }'

# Expected: Response within 35 seconds (30s timeout + processing)
# Should not hang indefinitely
```

### Success Criteria

- ✅ Request completes within expected time (not indefinite)
- ✅ Logs show timeout error
- ✅ Application created with aiScore = null (graceful degradation)

---

## Test 7: Concurrent Requests

### Purpose

Verify system handles multiple simultaneous applications with AI matching.

### Steps

```bash
# Create a script to submit multiple requests concurrently
cat > /tmp/test_concurrent.sh << 'EOF'
#!/bin/bash

TOKEN="your_token_here"
JOB_ID="your_job_id_here"

# Submit 10 concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/v1/applications \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"jobId\": \"$JOB_ID\", \"resumeUrl\": \"url$i.pdf\"}" &
done

wait
echo "All requests completed"
EOF

chmod +x /tmp/test_concurrent.sh
/tmp/test_concurrent.sh
```

### Success Criteria

- ✅ All 10 requests complete without errors
- ✅ All applications created
- ✅ All scores computed
- ✅ No connection pool exhaustion
- ✅ No database connection errors

### Verify

```bash
# Check application count
docker-compose exec mongodb mongosh -u root -p root << 'EOF'
use job-service-portal
db.applications.countDocuments()
EOF

# Check logs for errors
docker-compose logs backend | grep -i "error\|pool"
```

---

## Test 8: Get Applications Sorted by Score

### Purpose

Verify recruiter can view applications sorted by AI score.

### Steps

```bash
# Assuming you have created multiple applications with different scores

# 1. Get all applications for a job sorted by AI score (descending)
curl http://localhost:5000/api/v1/jobs/$JOB_ID/applications/sorted \
  -H "Authorization: Bearer $RECRUITER_TOKEN"

# Expected: Array of applications, highest scores first
# [
#   { _id: "...", student: {...}, aiScore: 85.30 },
#   { _id: "...", student: {...}, aiScore: 78.41 },
#   { _id: "...", student: {...}, aiScore: 65.20 },
# ]

# 2. Get sorted ascending
curl http://localhost:5000/api/v1/jobs/$JOB_ID/applications/sorted?sort=asc \
  -H "Authorization: Bearer $RECRUITER_TOKEN"

# Expected: Lowest scores first

# 3. Limit results
curl http://localhost:5000/api/v1/jobs/$JOB_ID/applications/sorted?limit=5 \
  -H "Authorization: Bearer $RECRUITER_TOKEN"

# Expected: Only top 5 applications
```

### Success Criteria

- ✅ Applications returned in correct sort order
- ✅ Each application includes aiScore
- ✅ Limit parameter respected
- ✅ Only applications with valid scores included

---

## Test 9: Logging and Tracing

### Purpose

Verify comprehensive logging for debugging distributed system.

### Steps

```bash
# 1. Create application and note request ID from logs
docker-compose logs backend | grep "request_id"

# 2. Trace request through all services
docker-compose logs | grep "a1b2c3d4" # Use actual request ID

# 3. Verify structured JSON logs
docker-compose logs ai-service | grep '{'

# Expected: JSON formatted logs with:
# {
#   "timestamp": "2024-01-15T10:30:45.123Z",
#   "level": "INFO",
#   "logger": "aiMatchingClient",
#   "message": "Similarity score computed",
#   "request_id": "a1b2c3d4",
#   "student_id": "...",
#   "job_id": "...",
#   "score": 82.41,
#   "duration_ms": 42
# }
```

### Success Criteria

- ✅ Logs contain request IDs for tracing
- ✅ Logs are JSON formatted (machine-readable)
- ✅ Timestamps in ISO 8601 format
- ✅ All relevant context included (student, job, score, duration)

---

## Test 10: Performance Benchmarks

### Purpose

Establish baseline performance metrics.

### Steps

```bash
# 1. Single request benchmark
time curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jobId": "'$JOB_ID'", "resumeUrl": "https://example.com/resume.pdf"}'

# Expected: < 5 seconds

# 2. AI service latency
docker-compose logs ai-service | grep "duration" | tail -5

# Expected: < 50ms per request

# 3. Database operation latency
docker-compose logs backend | grep "Database" | tail -5

# Expected: < 100ms per operation

# 4. Load test (using Apache Bench if available)
ab -n 100 -c 10 http://localhost:5000/api/v1/jobs
```

### Success Criteria

- ✅ Application creation: < 5 seconds
- ✅ AI matching: < 50ms
- ✅ Database operations: < 100ms
- ✅ No performance degradation under load

---

## Troubleshooting Checklist

### Issue: "Cannot reach AI service"

- [ ] AI service container running (`docker-compose ps`)
- [ ] Port 8000 exposed correctly
- [ ] Health check endpoint responds
- [ ] Network connectivity between containers
- [ ] Firewall rules not blocking

### Issue: "AI scores always null"

- [ ] Check backend logs for error codes
- [ ] Verify resume content fetching is implemented
- [ ] Verify AI service returns valid response
- [ ] Check network connectivity

### Issue: "Requests timing out"

- [ ] Check AI service latency
- [ ] Verify timeout configuration (AI_SERVICE_TIMEOUT)
- [ ] Check database connection pool
- [ ] Monitor resource usage (CPU, memory)

### Issue: "Memory usage high"

- [ ] Check for memory leaks in logs
- [ ] Verify model is only loaded once (singleton)
- [ ] Check for unbounded cache growth
- [ ] Restart containers to reset

### Issue: "Database connection pool exhausted"

- [ ] Check connection limit configuration
- [ ] Verify connections are released
- [ ] Monitor active connections
- [ ] Increase pool size if needed

---

## Performance Optimization

### If Application Creation is Slow

```javascript
// Make AI scoring async (don't block user)
async function createApplication(data) {
    const app = await db.applications.create(data);

    // Compute score in background
    computeAndStoreScore(app._id).catch((err) => {
        logger.error('Background scoring failed', { error: err });
    });

    return app; // Return immediately
}
```

### If AI Service is Slow

```yaml
# Scale horizontally in docker-compose.yml
services:
    ai-service:
        deploy:
            replicas: 3
```

### If Database is Slow

```javascript
// Add indexes
db.applications.createIndex({ job: 1, aiScore: -1 });
db.applications.createIndex({ student: 1 });
```

---

## Quick Test Commands

```bash
# All-in-one test script
#!/bin/bash

echo "1. Checking services..."
docker-compose ps

echo "2. Testing AI service..."
curl http://localhost:8000/api/v1/ai/health

echo "3. Testing backend..."
curl http://localhost:5000

echo "4. Testing database..."
docker-compose exec mongodb mongosh -u root -p root --eval "db.serverStatus()"

echo "5. Checking logs for errors..."
docker-compose logs | grep -i "error\|fail" | tail -10

echo "All tests completed!"
```

---

## Additional Resources

- [Backend + AI Integration Architecture](./BACKEND_AI_INTEGRATION.md)
- [AI Service Quick Start](./ai-layer/QUICK_START.md)
- [Logging Guide](./ai-layer/LOGGING_GUIDE.md)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
