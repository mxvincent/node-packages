/**
 * Key used to inject configuration using environment variables
 */
export enum TelemetryConfigKey {
	SERVICE_NAME = 'TELEMETRY_SERVICE_NAME',
	SERVICE_NAMESPACE = 'TELEMETRY_SERVICE_NAMESPACE',
	SERVICE_VERSION = 'TELEMETRY_SERVICE_VERSION',
	EXPORTER_TYPE = 'TELEMETRY_EXPORTER_TYPE',
	DETECTOR_GCP = 'TELEMETRY_DETECTOR_GCP',
	DETECTOR_CONTAINER = 'TELEMETRY_DETECTOR_CONTAINER'
}