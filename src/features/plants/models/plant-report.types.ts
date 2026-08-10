export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PlantReport {
  identification: {
    commonName: string;
    botanicalName: string;
    confidencePercent: number;
  };
  health: {
    status: HealthStatus;
    description: string;
    diagnosis: string;
    threatLevel: ThreatLevel;
    pestsOrDiseasesFound: boolean;
  };
}
