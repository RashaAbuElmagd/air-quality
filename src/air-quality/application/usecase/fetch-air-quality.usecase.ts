import { Injectable } from '@nestjs/common';
import { Location } from '../../domain/valueobject/location.vo';
import { AirQuality } from '../../domain/model/air-quality.model';
import { IQAirApiClient } from '../../infrastructure/acl/iqair-api.client';

@Injectable()
export class FetchAirQualityUseCase {
  constructor(private readonly iqairApiClient: IQAirApiClient) {}

  async execute(latitude: number, longitude: number): Promise<AirQuality> {
    const location = new Location(latitude, longitude);
    return this.iqairApiClient.fetchAirQuality(location);
  }
} 