import { containerDetector } from '@opentelemetry/resource-detector-container'
import { gcpDetector } from '@opentelemetry/resource-detector-gcp'
import {
  Detector,
  DetectorSync,
  envDetectorSync,
  hostDetectorSync,
  IResource,
  processDetectorSync,
  Resource,
  ResourceDetectionConfig
} from '@opentelemetry/resources'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
  SEMRESATTRS_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions'
import { TelemetryConfig } from './config/schemas'

const awaitAttributes = (detector: DetectorSync): Detector => {
  return {
    async detect(config?: ResourceDetectionConfig): Promise<IResource> {
      const resource = detector.detect(config)
      await resource.waitForAsyncAttributes?.()
      return resource
    }
  }
}

export const getResourceDetectors = (config: TelemetryConfig): Detector[] => {
  const detectors = [
    awaitAttributes(envDetectorSync),
    awaitAttributes(processDetectorSync),
    awaitAttributes(hostDetectorSync)
  ]
  if (config.detectors.container) {
    detectors.push(containerDetector)
  }
  if (config.detectors.gcp) {
    detectors.push(gcpDetector)
  }
  return detectors
}

export const getResource = ({ service }: TelemetryConfig) => {
  return new Resource({
    [SEMRESATTRS_SERVICE_NAMESPACE]: service.namespace,
    [SEMRESATTRS_SERVICE_NAME]: service.name,
    [SEMRESATTRS_SERVICE_VERSION]: service.version
  })
}
