"""
Backend + AI Service Integration Architecture

This document explains the design decisions and best practices for integrating
the Node.js backend with the Smart AI Matching Service (FastAPI).

TLDR: Backend = Orchestration. AI Service = Stateless. Communication = Resilient.
"""

# =============================================================================

# 1. SYSTEM ARCHITECTURE OVERVIEW

# =============================================================================

## Component Responsibilities

### Backend (Node.js + Express)

- **Orchestration**: Coordinate requests across services
- **Data Management**: Direct database access (MongoDB)
- **Business Logic**: Application creation, job posting, user management
- **External Integration**: Call AI service, handle responses
- **Error Handling**: Retry logic, fallbacks
- **Logging**: Request tracking, audit trails

### AI Service (FastAPI - Python)

- **Stateless**: No database access
- **Single Responsibility**: Compute similarity scores
- **Inference Only**: Run ML models (no side effects)
- **Input Validation**: Reject invalid requests early
- **Response Format**: Structured JSON responses

### Database (MongoDB)

- **Owned by Backend**: Only backend writes/reads
- **Centralized State**: Single source of truth
- **Applications Table**: Stores scores alongside application data

```
Frontend (React)
    ↓
Backend (Node.js/Express)  ← Orchestration layer (API, DB, validation)
    ↓
MongoDB  ← Application + AI scores stored here
    ↓
AI Service (FastAPI)  ← Stateless, read-only (no DB access)
```

---

# =============================================================================

# 2. WHY ORCHESTRATION STAYS IN BACKEND

# =============================================================================

## Problem It Solves

**Naive architecture (WRONG):**

```
Frontend → AI Service (tries to orchestrate)
Frontend → Database (multiple callers confusing)
Frontend → Backend (some operations)
→ Result: Tangled dependencies, hard to maintain
```

**Backend orchestration (CORRECT):**

```
Frontend → Backend (single entry point)
Backend → AI Service (managed communication)
Backend → Database (single owner)
→ Result: Clean, maintainable, auditable
```

## Key Reasons

### 1. **Single Point of Control**

Backend is the authoritative orchestrator:

```javascript
// Backend coordinates the workflow
async function createApplicationWithMatching(studentId, jobId, resumeUrl) {
  // Validate inputs
  const validation = validateApplicationInput(...);

  // Check business rules (duplicate applications, etc.)
  const existing = await db.applications.findOne(...);

  // Create application in database
  const application = await db.applications.create(...);

  // Call AI service (asynchronously)
  const score = await aiService.match(...);

  // Update database with score
  await db.applications.updateOne(...);

  // Log audit trail
  await db.audit.log(...);

  return application;
}
```

If frontend called AI service directly:

- How does frontend know about business rules?
- Where does frontend store the score?
- Multiple callers (frontend + backend) = race conditions
- Audit trail is incomplete

### 2. **Error Handling and Resilience**

Backend handles failures consistently:

```javascript
// Backend with retry logic
try {
  const score = await aiService.match(resume, job, { retries: 2 });
  // Success: update database
} catch (error) {
  if (error.isRetryable && retries < MAX_RETRIES) {
    // Retry with exponential backoff
    await sleep(backoffDelay);
    return computeScore(...);  // Retry
  }
  // Log failure but don't crash
  logger.error('AI service failed', { error });
  // Application still created, just without score
}
```

Frontend doesn't have this sophistication.

### 3. **Data Consistency**

Backend ensures consistency:

```javascript
// Transactional flow (conceptual - MongoDB doesn't have ACID transactions in MVP)
const session = await db.startSession();
try {
  // Create application
  const app = await db.applications.create(..., { session });

  // Compute score
  const score = await aiService.match(...);

  // Atomically update application with score
  await db.applications.updateOne({ _id: app._id }, { aiScore: score }, { session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

With direct frontend → AI service → Database:

- Application created without score
- AI service computed but frontend didn't update database
- Data in inconsistent state

### 4. **Authentication and Authorization**

Backend validates permissions:

```javascript
// Backend checks: Does this user own this application?
const application = await db.applications.findOne({
    _id: applicationId,
    student: req.user._id, // Ensure user owns it
});

if (!application) {
    return res.status(403).json({ error: 'Unauthorized' });
}

// Only then call AI service or update database
```

If frontend called AI service directly:

- AI service doesn't know who made the request
- Anyone could request scoring for any application
- Security vulnerability

### 5. **Audit and Compliance**

Backend maintains complete audit trail:

```javascript
// Every action logged in backend
logger.info('Application created with AI matching', {
    application_id: appId,
    student_id: studentId,
    job_id: jobId,
    ai_score: 82.41,
    timestamp: Date.now(),
    user_agent: req.get('user-agent'),
    ip_address: req.ip,
});

// Later: "Who created this application? When? With what score?"
```

Frontend logs are browser-local, lost on refresh.

---

# =============================================================================

# 3. BENEFITS OF STATELESS AI SERVICES

# =============================================================================

## What Does "Stateless" Mean?

**Stateful (BAD):**

```python
class AIService:
  def __init__(self):
    self.cache = {}  # State!
    self.user_preferences = {}  # State!
    self.request_count = 0  # State!

  def match(self, resume, job):
    self.request_count += 1  # Modifies state
    # ... computation
```

Problems:

- Multiple instances disagree on state
- Hard to restart/scale
- Memory leaks from cache buildup
- Debugging: "which instance has the right cache?"

**Stateless (GOOD):**

```python
def match(resume: str, job_description: str) -> float:
  # Pure function: same inputs → same output, no side effects
  embeddings = model.encode([resume, job_description])
  similarity = cosine_similarity(embeddings)
  return similarity

# Can run anywhere, anytime, same result
```

## Key Benefits

### 1. **Horizontal Scaling**

Easy to run multiple instances:

```yaml
# docker-compose.yml
services:
    ai-service-1:
        image: ai-matching:latest

    ai-service-2:
        image: ai-matching:latest

    ai-service-3:
        image: ai-matching:latest

    nginx: upstream ai_service {
        server ai-service-1:8000;
        server ai-service-2:8000;
        server ai-service-3:8000;
        }
```

All three instances are identical (no state conflicts).

### 2. **Container Orchestration**

Kubernetes loves stateless services:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: ai-service
spec:
    replicas: 3 # Run 3 instances
    selector:
        matchLabels:
            app: ai-service
    template:
        metadata:
            labels:
                app: ai-service
        spec:
            containers:
                - name: ai-service
                  image: ai-matching:latest
                  resources:
                      requests:
                          memory: '512Mi'
                          cpu: '500m'
```

Kubernetes automatically:

- Kills crashed instances (no state to lose)
- Scales up during traffic spikes
- Replaces with new version (zero downtime)
- Load-balances requests across instances

### 3. **No Database Lock-in**

AI service doesn't couple to database:

```python
# ✅ Good: AI service is independent
def match(resume_text, job_text):
  return cosine_similarity(embeddings)

# ❌ Bad: AI service tied to database
def match(resume_id, job_id):
  resume = db.resumes.find_one({'_id': resume_id})
  job = db.jobs.find_one({'_id': job_id})
  return cosine_similarity(embeddings)
  # Now AI service MUST have database access
  # Tight coupling
  # Can't easily test
  # Can't run multiple instances (DB contention)
```

### 4. **Easy Testing and Debugging**

Test without infrastructure:

```python
# Pure function: trivial to test
def test_match():
  score = match(
    "Python developer",
    "Seeking Python engineer"
  )
  assert 70 <= score <= 100

# No database setup
# No external dependencies
# Deterministic (same inputs → same output)
```

### 5. **Disaster Recovery**

Restart without data loss:

```bash
# Container crashed? Just restart it
docker restart ai-service-1

# Service immediately ready (no state to recover)
# Backend retries the request
# User doesn't notice
```

Stateful service:

```
Container crashes
↓
State lost (cache, connections, etc.)
↓
Restart reads stale state
↓
Incorrect results until cache rebuilds
```

### 6. **Cost Efficiency**

No need for persistent storage:

```
Stateful service:
- Needs persistent volume (expensive)
- Needs backup/disaster recovery
- Needs replication for HA

Stateless service:
- Only needs compute (cheap, ephemeral)
- No backup needed (just stateless)
- Can autoscale up/down
```

---

# =============================================================================

# 4. DISTRIBUTED SYSTEM COMMUNICATION BEST PRACTICES

# =============================================================================

## Challenge: The Network is Unreliable

In distributed systems, assume:

- Network delays (latency)
- Packet loss
- Service restarts
- Deployment/rollouts
- Traffic spikes
- Database connection pool exhaustion

**Naive approach (WRONG):**

```javascript
// Frontend directly calls AI service
const score = await axios.post('http://ai-service:8000/match', data);
// Fails if: AI service down, network down, timeout
// No retry, no fallback
```

**Production approach (CORRECT):**

```javascript
// Backend calls with resilience
const score = await aiMatchingClient.computeSimilarityScore(resume, job);
// Includes: retries, timeouts, fallbacks, logging
```

## Best Practice 1: Timeouts

**Problem:**

```javascript
// Infinite wait if AI service hangs
axios.post('http://ai-service:8000/match', data);
// Frontend waits 5 minutes? 30 minutes? Forever?
```

**Solution:**

```javascript
// Always set timeout
axios.post('http://ai-service:8000/match', data, {
    timeout: 30000, // 30 seconds
});

// Still fails after 30s, but at least we know when
```

## Best Practice 2: Retries with Backoff

**Problem:**

```javascript
// Single attempt - fails on transient errors
const response = await axios.post(url, data);
// AI service was temporarily restarting? Too bad, user sees error
```

**Solution:**

```javascript
// Retry on transient errors with exponential backoff
async function computeScoreWithRetries(resume, job, maxRetries = 2) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await computeSimilarityScore(resume, job);
        } catch (error) {
            const isRetryable = !isClientError(error);
            const isLastAttempt = attempt === maxRetries;

            if (!isRetryable || isLastAttempt) {
                throw error; // Give up
            }

            // Wait before retrying (exponential backoff)
            const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
            await sleep(delay);
        }
    }
}

// Retry timeline:
// Attempt 1: fails (transient error)
// Wait 1 second
// Attempt 2: succeeds (service recovered)
// User never sees error!
```

## Best Practice 3: Circuit Breaker Pattern

**Problem:**

```javascript
// AI service is broken, retrying 100 times doesn't help
for (let i = 0; i < 100; i++) {
  try {
    return await computeScore(...);
  } catch (error) {
    await sleep(1000);  // Just keeps retrying
  }
}
// Wastes 100+ seconds per user request
```

**Solution:**

```javascript
// Circuit breaker: stop trying if service is consistently broken
const breaker = new CircuitBreaker({
    failureThreshold: 5, // Open after 5 failures
    timeout: 60000, // Try to close after 60s
});

const computeScore = breaker.execute(async (resume, job) => {
    return await aiService.match(resume, job);
});

// Timeline:
// Request 1: fails
// Request 2: fails
// Request 3: fails
// Request 4: fails
// Request 5: fails → Circuit OPENS
// Request 6: Immediately rejected (don't even try)
// Request 7: Immediately rejected
// ... 60 seconds later ...
// Request 100: Try again (Circuit testing)
// If it works: Circuit CLOSES
// If fails: Circuit stays OPEN
```

## Best Practice 4: Graceful Degradation

**Problem:**

```javascript
// Application creation fails if AI service fails
async function createApplication(data) {
    const score = await aiService.match(data.resume, data.job);
    const app = await db.applications.create({ ...data, aiScore: score });
    return app;
}

// If AI service down: application NOT created
// User sees error immediately
```

**Solution:**

```javascript
// Create application even if AI service fails
async function createApplication(data) {
    const app = await db.applications.create(data);

    try {
        const score = await aiService.match(data.resume, data.job);
        await db.applications.updateOne({ _id: app._id }, { aiScore: score });
    } catch (error) {
        logger.warn('AI scoring failed', { error });
        // Application still created, just without score
        // Score can be computed later
    }

    return app;
}

// Result:
// - Core functionality works (users can apply)
// - AI scoring is a bonus (nice-to-have)
// - If AI service down: users still see "Application created" ✓
```

## Best Practice 5: Logging and Tracing

**Problem:**

```javascript
// 10 requests failing, no idea which one or why
requests = [
    { status: 'failed', error: 'timeout' },
    { status: 'failed', error: 'timeout' },
    { status: 'failed', error: 'connection refused' },
];
// Which user? Which job? Which resume?
```

**Solution:**

```javascript
// Log with context (request ID, timestamps, metadata)
logger.error('AI Service Error', {
    request_id: 'a1b2c3d4', // Trace across services
    student_id: userId, // Who made the request?
    job_id: jobId, // Which job?
    error_code: 'TIMEOUT', // What failed?
    duration_ms: 30000, // How long did it take?
    retry_count: 2, // How many attempts?
    service_status: 'degraded', // System health?
});

// Later: Search logs for request ID to see entire flow
// Or search for error code to find patterns
```

## Best Practice 6: Bulkheads (Resource Isolation)

**Problem:**

```javascript
// AI service requests hog connection pool
// Database requests starve and fail
const pool = new ConnectionPool({ maxConnections: 10 });

// AI requests use 8 connections
// Database requests only get 2 → FAIL
```

**Solution:**

```javascript
// Separate connection pools
const aiServicePool = new ConnectionPool({ maxConnections: 20 });
const databasePool = new ConnectionPool({ maxConnections: 50 });

// AI request from aiServicePool (doesn't affect database)
// Database request from databasePool (doesn't affect AI service)
```

## Best Practice 7: Health Checks

**Problem:**

```javascript
// Load balancer routes to dead AI service instances
await axios.post('http://dead-ai-instance/match', data);
// Timeout, fail, timeout, fail...
```

**Solution:**

```javascript
// Health check endpoint
setInterval(async () => {
    try {
        const response = await axios.get('/health', { timeout: 5000 });
        if (response.data.ready) {
            markHealthy(instance);
        }
    } catch (error) {
        markUnhealthy(instance); // Remove from rotation
    }
}, 10000);

// Load balancer: only route to healthy instances
```

---

# =============================================================================

# 5. INTEGRATION CHECKLIST

# =============================================================================

## Backend (Node.js) Responsibilities

- [x] Create AI Matching Client (`aiMatchingClient.js`)
    - [x] Axios configuration with timeouts
    - [x] Retry logic with exponential backoff
    - [x] Request/response logging
    - [x] Error handling with error codes

- [x] Update Application Service (`application.service.js`)
    - [x] Fetch resume content (placeholder for MVP)
    - [x] Fetch job description
    - [x] Call AI service
    - [x] Store score in MongoDB
    - [x] Graceful degradation (create app even if AI fails)

- [x] Add Logger (`config/logger.js`)
    - [x] Structured logging (JSON)
    - [x] Log levels (debug, info, warn, error)
    - [x] Request tracing support

- [ ] Add Environment Variables
    - AI_SERVICE_URL (default: http://localhost:8000/api/v1/ai)
    - AI_SERVICE_TIMEOUT (default: 30000ms)
    - AI_SERVICE_MAX_RETRIES (default: 2)
    - LOG_LEVEL (default: INFO)

- [ ] Add API Endpoints
    - GET /api/v1/applications/:id (with AI score)
    - POST /api/v1/applications/:id/rescore (recompute AI score)
    - GET /api/v1/jobs/:id/applications (sorted by AI score)

- [ ] Add Tests
    - Mock AI service responses
    - Test retry logic
    - Test graceful degradation
    - Test error handling

## AI Service (FastAPI) Responsibilities

- [x] Implement /api/v1/ai/match endpoint
- [x] Return JSON with similarityScore (0-100)
- [x] Implement /api/v1/ai/health endpoint
- [x] Stateless (no database access)
- [x] Structured logging
- [x] Request validation
- [x] Error codes for failures

---

# =============================================================================

# 6. PRODUCTION DEPLOYMENT ARCHITECTURE

# =============================================================================

```
┌─────────────────────────────────────────┐
│          Load Balancer (Nginx)          │
│  - Route /api/* → Backend               │
│  - Route /ai/* → AI Service             │
│  - Health checks every 10s              │
└────────┬────────────────────────────────┘
         │
    ┌────┴─────┬─────────────────┐
    ↓          ↓                 ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│Backend-1│  │Backend-2│  │Backend-3│  (Node.js, 3 instances)
│Port 3000│  │Port 3000│  │Port 3000│  - Orchestration
└────┬────┘  └────┬────┘  └────┬────┘  - API endpoints
     │           │              │       - Database queries
     └───────────┼──────────────┘
             ↓
        ┌──────────────┐
        │   MongoDB    │  (Central database)
        │  Database    │  - Single source of truth
        └──────────────┘

    ┌────┴─────┬──────────────┐
    ↓          ↓              ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│  AI-1   │  │  AI-2   │  │  AI-3   │  (FastAPI, auto-scaling)
│Port 8000│  │Port 8000│  │Port 8000│  - Stateless
└─────────┘  └─────────┘  └─────────┘  - Pure inference
             (Kubernetes)              - No database access
             - Auto-scales on CPU     - Horizontal scaling
             - Replaces on failure
```

---

# =============================================================================

# 7. TROUBLESHOOTING GUIDE

# =============================================================================

## Scenario 1: AI Service Returns Score = null

**Symptoms:**

```
Application created but aiScore is null
```

**Causes:**

1. Resume content fetching failed (fetchResumeContent returns null)
2. AI service returned invalid response
3. Error caught, logged, but application still created (graceful degradation)

**Debug:**

```bash
# Check backend logs for AI matching errors
grep "AI matching failed" backend/logs/*
grep "Could not fetch resume content" backend/logs/*

# Check AI service logs
docker logs ai-service

# Manually test AI service
curl -X POST http://localhost:8000/api/v1/ai/match \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "Python developer", "jobDescription": "Seeking Python engineer"}'
```

## Scenario 2: Slow Requests (>5s latency)

**Symptoms:**

```
User complains: "Creating application takes forever"
```

**Causes:**

1. AI service slow (check response time in logs)
2. Database slow (check MongoDB)
3. Network latency
4. Retries happening (AI service temporarily down)

**Debug:**

```javascript
// Check AI service latency
logger.info('AI matching took 5.2 seconds - SLOW');

// Solutions:
// 1. Async computation (don't block on score)
// 2. Cache scores (if same resume/job pair)
// 3. Batch process scores offline
// 4. Scale AI service (add more instances)
```

## Scenario 3: AI Service Consistently Down

**Symptoms:**

```
Error rate high, AI scores never computed
```

**Solutions:**

1. Check AI service health
2. Verify network connectivity
3. Check resource limits (memory, CPU)
4. Review recent code changes

**Debug:**

```bash
# Is AI service running?
docker ps | grep ai-service

# Can backend reach it?
curl -X GET http://localhost:8000/api/v1/ai/health

# Check AI service resource usage
docker stats ai-service

# Check logs
docker logs ai-service
```

---

# =============================================================================

# 8. MIGRATION PATH FOR FUTURE ENHANCEMENTS

# =============================================================================

## Phase 2: Batch Processing

- Async job queue (Bull, RabbitMQ)
- Compute scores in background
- Don't block user requests

## Phase 3: Caching

- Cache embeddings (for same resume/job pairs)
- Reduce AI service calls
- Faster repeated comparisons

## Phase 4: Real-time Sorting

- Update frontend with sorted applications
- WebSocket for live score updates
- Recruiter dashboard shows high-scoring candidates first

## Phase 5: Advanced ML

- Fine-tune model on feedback
- A/B test different models
- Personalized scoring (per recruiter preferences)

## Phase 6: Multi-Service Architecture

- Separate services for different domains
- Skill matching service
- Experience level matching
- Salary expectation matching
