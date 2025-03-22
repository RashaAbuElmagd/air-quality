import { AirQuality } from '../../domain/model/air-quality.model';
import { Location } from '../../domain/valueobject/location.vo';

export interface IQAirApiPort {
  fetchAirQuality(location: Location): Promise<AirQuality>;
} 