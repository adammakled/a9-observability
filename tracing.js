// tracing.js - OpenTelemetry setup for todo-service.
// Modified from the Jaeger exporter to the OTLP exporter: Jaeger v2 accepts
// OTLP natively on port 4318 (HTTP) / 4317 (gRPC).
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter, SimpleSpanProcessor, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-node');

const otlpExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  serviceName: 'todo-service',
  spanProcessors: [
    new BatchSpanProcessor(otlpExporter),              // send spans to Jaeger
    new SimpleSpanProcessor(new ConsoleSpanExporter()) // also print spans to the console
  ],
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false }, // too noisy
    }),
  ],
});

sdk.start();
console.log('OpenTelemetry tracing initialized (OTLP -> Jaeger)');

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((err) => console.error('Error terminating tracing', err))
    .finally(() => process.exit(0));
});
