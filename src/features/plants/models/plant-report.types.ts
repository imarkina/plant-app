export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PlantReport {
  identification: {
    commonName: string;
    botanicalName: string;
    confidencePercent: number;
  };
  health: {
    status?: HealthStatus;
    description?: string;
    diagnosis?: string;
    threatLevel?: ThreatLevel;
    pestsOrDiseasesFound?: boolean;
  };
  actionPlan: {
    urgentActions: string[];
    prohibitions: string[];
  };
  carePassport: {
    lighting: {
      summary: string;
      details: string;
      idealPlacement: string;
    };
    watering: {
      frequency: string;
      waterQuality: string;
    };
    environment: {
      humidity: string;
      temperatureMinC: number;
      temperatureOptimal: string;
      notes?: string;
    };
    soilAndPot: {
      soilMix: string;
      potType: string;
      repottedWhen: string;
    };
    fertilizing: {
      schedule: string;
      dosage: string;
      warnings: string;
    };
  };
}
