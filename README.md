# E-Commerce Product Service

Microservice for managing product catalog in an e-commerce platform, built with Node.js, Express, and PostgreSQL. The service includes comprehensive security scanning, automated testing, and Kubernetes deployment.

## Features

- **RESTful API** for product management (CRUD operations)
- **PostgreSQL** database with connection pooling
- **Docker** containerization
- **Kubernetes** deployment
- **CI/CD pipeline** with GitHub Actions
- **Security scanning** (Trivy, Snyk, SonarQube)
- **Automated testing** with Jest
- **Request validation** using Joi
- **Structured logging** with Winston

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Kubernetes cluster (or Minikube for local development)
- kubectl CLI tool

## Installation

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd services/product-services
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the `services/product-services` directory:
```env
DB_HOST=localhost
DB_NAME=product
DB_USER=postgres
DB_PASSWORD=password
DB_PORT=5432
PORT=3001
NODE_ENV=development
```

4. **Start PostgreSQL with Docker Compose**
```bash
docker compose up -d
```

5. **Run the application**
```bash
npm start
```

The service will be available at `http://localhost:3001`

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Docker Deployment

### Build the Docker image
```bash
docker build -t e-commerce-product-service:latest ./services/product-services
```

### Run with Docker Compose
```bash
docker compose up
```

This will start both the product service and PostgreSQL database.

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster running (or Minikube)
- kubectl configured

### Deploy to Kubernetes

1. **Apply Kubernetes manifests**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/product-service.yaml
```

2. **Verify deployment**
```bash
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
```

3. **Access the service**
```bash
kubectl port-forward svc/product-service 3001:80 -n ecommerce
```

The API will be available at `http://localhost:3001`

### Using Kustomize

Alternatively, deploy using Kustomize:
```bash
kubectl apply -k k8s/
```

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create a new product |
| GET | `/api/products` | Get all products (with optional filters) |
| GET | `/api/products/:id` | Get a product by ID |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product (soft delete) |

### Query Parameters for GET /api/products
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `limit` - Limit number of results

### Example Request

**Create a product:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "electronics",
    "stock_quantity": 50,
    "image_url": "https://example.com/laptop.jpg"
  }'
```

**Get all products:**
```bash
curl http://localhost:3001/api/products
```

**Get products with filters:**
```bash
curl "http://localhost:3001/api/products?category=electronics&minPrice=100&maxPrice=1000"
```

## Security Features

- **Helmet.js** for secure HTTP headers
- **CORS** enabled
- **Input validation** with Joi schemas
- **SQL injection protection** via parameterized queries
- **Network policies** in Kubernetes
- **Security context** with non-root user
- **Read-only root filesystem**
- **Dropped capabilities**
- **Resource limits** defined

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow (`ci.yaml`) that:

1. **Security Scanning**
   - SonarQube code quality analysis
   - Trivy container vulnerability scanning
   - Snyk dependency vulnerability checking

2. **Build & Test**
   - Automated unit testing
   - Code coverage reporting


3. **Kubernetes Deployment**
   - Automated deployment to Minikube
   - Deployment status reporting

### Required GitHub Secrets

Configure the following secrets in your GitHub repository:

- `SONAR_TOKEN` - SonarQube authentication token
- `SONAR_PROJECT_KEY` - SonarQube project key
- `SONAR_ORGANIZATION` - SonarQube organization
- `SNYK_TOKEN` - Snyk API token
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `PORT` - Database configuration

### Kubernetes Resources

- **Namespace**: `ecommerce`
- **Replicas**: 2 (product-service)
- **Resource Limits**: 
  - Product Service: 256Mi RAM, 200m CPU
  - PostgreSQL: 512Mi RAM, 500m CPU
- **Network Policies**: Ingress and egress rules configured

## Monitoring

View logs in Kubernetes:
```bash
kubectl logs -f deployment/product-service -n ecommerce
```

Check pod status:
```bash
kubectl get pods -n ecommerce -w
```