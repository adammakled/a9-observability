#!/usr/bin/env bash
# One-shot runner: starts MongoDB + Jaeger, the traced server, and sends test requests.
set -e
docker rm -f mongo jaeger >/dev/null 2>&1 || true
docker run -d --name mongo -p 27017:27017 mongo:7
docker run -d --name jaeger \
  -p 16686:16686 -p 4317:4317 -p 4318:4318 -p 5778:5778 -p 9411:9411 \
  jaegertracing/jaeger:2.5.0
[ -d node_modules ] || npm install
sleep 5
node --require ./tracing.js index.js > server.log 2>&1 &
sleep 5
for i in 1 2 3; do curl -s http://localhost:3000/todo; echo; done
curl -s http://localhost:3000/todo/1; echo
curl -s http://localhost:3000/todo/2; echo
curl -s http://localhost:3000/todo/99; echo
sleep 6
echo
echo "Done. Open the PORTS tab, click the globe icon on port 16686 (Jaeger UI),"
echo "pick service 'todo-service', press Find Traces, and open a trace."
echo "Server console output (logs + spans) is in server.log"
