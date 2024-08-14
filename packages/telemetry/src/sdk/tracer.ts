import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SpanExporter } from '@opentelemetry/sdk-trace-node'
import { TelemetryConfig } from '../config/schemas'

export const getTraceExporter = (config: TelemetryConfig): SpanExporter => {
  switch (config.exporter.type) {
    case 'GCP':
      return new TraceExporter()
    case 'HTTP':
      return new OTLPTraceExporter()
  }
}
