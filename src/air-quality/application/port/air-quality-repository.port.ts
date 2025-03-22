import { AirQuality } from '../../domain/model/air-quality.model';

export interface AirQualityRepositoryPort {
  save(airQuality: AirQuality): Promise<AirQuality>;
  findMostPolluted(city: string): Promise<AirQuality | null>;
} 