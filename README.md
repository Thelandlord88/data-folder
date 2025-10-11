# data-folder

A multi-language webhook implementation supporting Python, Java, and TypeScript.

## Prerequisites

- Python 3.8 or higher
- Java 11 or higher (with Maven)
- Node.js 18 or higher (with npm)
- TypeScript

## Installation

### Python Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Java Setup

1. Install dependencies and build the project:
```bash
mvn clean install
```

### TypeScript Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Build the TypeScript project:
```bash
npm run build
```

## Running the Webhook Servers

### Python Webhook (Port 5000)

```bash
python webhook.py
```

The Python webhook server will run on `http://localhost:5000`

### Java Webhook (Port 8080)

```bash
mvn exec:java -Dexec.mainClass="com.datafolder.WebhookServer"
```

Or compile and run:
```bash
mvn package
java -cp target/data-folder-1.0.0.jar com.datafolder.WebhookServer
```

The Java webhook server will run on `http://localhost:8080`

### TypeScript Webhook (Port 3000)

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The TypeScript webhook server will run on `http://localhost:3000`

## API Endpoints

All three webhook implementations provide the same endpoints:

- `POST /webhook` - Webhook endpoint to receive data
- `GET /health` - Health check endpoint

## Testing the Webhooks

### Using curl

Python webhook:
```bash
curl -X POST http://localhost:5000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "hello"}'
```

Java webhook:
```bash
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "hello"}'
```

TypeScript webhook:
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "hello"}'
```

### Health Check

```bash
curl http://localhost:5000/health
curl http://localhost:8080/health
curl http://localhost:3000/health
```

## Project Structure

```
.
├── README.md
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── pom.xml                   # Maven configuration for Java
├── webhook.py                # Python webhook implementation
└── src/
    ├── index.ts              # TypeScript webhook implementation
    └── main/java/com/datafolder/
        └── WebhookServer.java # Java webhook implementation
```
