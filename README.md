# A9 – Observability with OpenTelemetry + Jaeger

An Express todo service backed by MongoDB, instrumented with OpenTelemetry. Traces are exported with the **OTLP exporter** to a Jaeger all-in-one container.

## Files
- `index.js` – Express server; `startServer()` connects to MongoDB, seeds sample todos, and starts listening on port 3000.
- `tracing.js` – OpenTelemetry NodeSDK setup. Auto-instruments HTTP, Express and MongoDB; exports spans via OTLP/HTTP to `http://localhost:4318/v1/traces` and also prints them to the console.
- `run.sh` – starts MongoDB and Jaeger in Docker, runs the server, and sends test requests.

## Run
```bash
docker run -d -p 27017:27017 mongo
docker run -d --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 -p 5778:5778 -p 9411:9411 jaegertracing/jaeger:2.5.0
npm install
node --require tracing.js index.js
curl http://localhost:3000/todo
```
Open http://localhost:16686, choose service **todo-service**, then **Find Traces**.

Or simply: `./run.sh` (works in GitHub Codespaces too).
