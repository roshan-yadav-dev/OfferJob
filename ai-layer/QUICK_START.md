# Smart AI Matching Service - Quick Start Guide

## 🚀 Starting the Service

```bash
# Navigate to project
cd "d:\Job Service Platform\ai-layer"

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

Access Swagger UI: `http://localhost:8000/docs`

---

## 📡 API Endpoints

### 1. Match Resume to Job

**Endpoint:** `POST /api/v1/ai/match`

**Request:**

```json
{
    "resumeText": "Senior Python developer with 8 years Django and FastAPI experience, REST APIs, microservices",
    "jobDescription": "Seeking Python backend engineer with REST API and database expertise, Docker knowledge preferred"
}
```

**Response:**

```json
{
    "similarityScore": 0.7834
}
```

### 2. Health Check

**Endpoint:** `GET /api/v1/ai/health`

**Response:**

```json
{
    "status": "healthy",
    "service": "AI Matching Service",
    "models_loaded": true,
    "ready_for_matching": true,
    "preload_on_startup": true,
    "service_info": {
        "status": "ready",
        "matcher": "semantic_similarity",
        "model": {
            "name": "all-MiniLM-L6-v2",
            "library": "sentence-transformers",
            "embedding_dimension": 384,
            "cache_dir": "./models",
            "status": "loaded"
        }
    },
    "message": "Sentence-transformer model loaded and ready"
}
```

### 3. List Available Models

**Endpoint:** `GET /api/v1/ai/models`

**Response:**

```json
{
    "models": [
        {
            "name": "all-MiniLM-L6-v2",
            "description": "Lightweight sentence transformer for MVP (22MB, 384-dim embeddings)",
            "status": "active",
            "version": "1.0.0",
            "type": "semantic_similarity",
            "library": "sentence-transformers",
            "embedding_dimension": 384,
            "performance": {
                "inference_time_ms": 5,
                "throughput_requests_per_sec": 200
            }
        }
    ]
}
```

---

## 💻 Usage Examples

### Python (Requests Library)

```python
import requests
import json

BASE_URL = "http://localhost:8000"

def match_resume_to_job(resume_text, job_description):
    """Match resume to job and get similarity score."""

    response = requests.post(
        f"{BASE_URL}/api/v1/ai/match",
        json={
            "resumeText": resume_text,
            "jobDescription": job_description
        }
    )

    if response.status_code == 200:
        result = response.json()
        return result["similarityScore"]
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
        return None

# Example usage
resume = "Senior Python developer with 8 years experience in Django and FastAPI"
job = "Seeking Python backend engineer with REST API expertise"

score = match_resume_to_job(resume, job)
print(f"Similarity Score: {score:.4f}")  # Output: Similarity Score: 0.7834
```

### cURL (Command Line)

```bash
curl -X POST "http://localhost:8000/api/v1/ai/match" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Python developer with 8 years experience",
    "jobDescription": "Seeking Python backend engineer"
  }' | jq .

# Output:
# {
#   "similarityScore": 0.7834
# }
```

### JavaScript/Node.js

```javascript
const BASE_URL = 'http://localhost:8000';

async function matchResumeToJob(resumeText, jobDescription) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/ai/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resumeText,
                jobDescription,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.similarityScore;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Example usage
const resume = 'Senior Python developer with 8 years experience';
const job = 'Seeking Python backend engineer';

matchResumeToJob(resume, job).then((score) => {
    console.log(`Similarity Score: ${score.toFixed(4)}`); // 0.7834
});
```

---

## 📊 Example Matching Results

### High Similarity (Same Field)

```
Resume:  "Senior Python developer with 8 years Django and FastAPI experience"
Job:     "Seeking Python backend engineer with REST API expertise"
Score:   0.7834 ✅ High match
```

### Medium Similarity (Related Field)

```
Resume:  "Frontend React specialist with 5 years JavaScript experience"
Job:     "Seeking backend Python engineer"
Score:   0.3308 ⚠️ Medium match
```

### Low Similarity (Different Field)

```
Resume:  "Accounting specialist with 10 years bookkeeping experience"
Job:     "Seeking Python backend engineer"
Score:   0.2800 ❌ Low match
```

---

## ⚙️ Configuration

Edit `.env` file to customize:

```env
# API Configuration
API_TITLE=Smart AI Matching Service
API_VERSION=1.0.0

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False

# CORS (Frontend Access)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080

# Model Configuration
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
MODEL_CACHE_DIR=./models
PRELOAD_MODELS_ON_STARTUP=True

# Logging
LOG_LEVEL=INFO
```

---

## 🧪 Running Tests

```bash
# Test embedding integration (comprehensive)
python test_embedding_integration.py

# Test service layer
python test_service_layer.py

# Test API endpoints
python test_ai_endpoints.py

# Test schemas/validation
python test_schemas.py

# Test end-to-end integration
python test_integration.py

# Run all tests with pytest
python -m pytest -v
```

---

## 📈 Performance Tips

### Increase Throughput

1. **Use Batch Endpoint** (if implemented)

    ```python
    # Send 100 matches at once instead of 1-by-1
    # 100 requests × 34ms = 3400ms (sequential)
    # 100 in batch × 5ms avg = 500ms (batched)
    # 7x improvement!
    ```

2. **Enable Response Caching**

    ```python
    # Same resume-job pair requested twice?
    # Redis cache returns in <1ms instead of 34ms
    ```

3. **Use Multiple Workers**
    ```bash
    # Replace single worker with multiple
    uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000
    # 4x throughput (if load balanced)
    ```

### Optimize Latency

1. **Monitor Cold Start**
    - First request: 50ms (after warmup)
    - Steady state: 34ms average

2. **Watch for Memory Leaks**

    ```bash
    # Monitor memory usage
    watch -n 1 'ps aux | grep python'
    ```

3. **Use Local Model Cache**
    ```
    ./models/ (downloaded once, reused forever)
    ```

---

## 🐳 Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build and Run:**

```bash
# Build image
docker build -t smart-ai-matching:latest .

# Run container
docker run -p 8000:8000 smart-ai-matching:latest

# Access at http://localhost:8000/docs
```

---

## 🔍 Debugging

### View Logs

```bash
# Start server with verbose logging
LOGLEVEL=DEBUG python -m uvicorn app.main:app --reload
```

### Check Model Status

```python
from app.services.embedding_service import get_embedding_service

es = get_embedding_service()
print(f"Model: {es.model_name}")
print(f"Dimension: {es.embedding_dimension}")
print(f"Cache: {es.cache_dir}")
```

### Profile Performance

```python
import time
from app.services.embedding_service import get_embedding_service

es = get_embedding_service()

# Time single embedding
start = time.time()
embedding = es.generate_embedding("test text")
print(f"Single embedding: {(time.time()-start)*1000:.2f}ms")

# Time batch embedding
start = time.time()
embeddings = es.generate_embeddings(["text1", "text2", "text3"])
print(f"Batch (3 items): {(time.time()-start)*1000:.2f}ms")
```

---

## ❓ Troubleshooting

### Error: "Model not found"

```
Solution: Model will auto-download on first use from HuggingFace
Wait 2-3 minutes on first startup
```

### Error: "Out of memory"

```
Solution:
- Use smaller batch sizes
- Reduce concurrent requests
- Upgrade to larger instance
```

### Slow Performance (>50ms)

```
Solution:
- Check CPU utilization (should be ~80-100% during inference)
- Ensure FastAPI has multiple workers
- Consider GPU acceleration for high throughput
```

### CORS Error

```
Solution: Check .env CORS_ORIGINS setting
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 📞 Support

For issues or questions:

1. Check logs: `LOGLEVEL=DEBUG python -m uvicorn app.main:app --reload`
2. Run tests: `python test_embedding_integration.py`
3. Verify health: `curl http://localhost:8000/api/v1/ai/health | jq`

---

## 📚 Additional Resources

- [Sentence-Transformers Documentation](https://www.sbert.net/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [HuggingFace Model Hub](https://huggingface.co/models)
- [PyTorch Documentation](https://pytorch.org/docs/)
