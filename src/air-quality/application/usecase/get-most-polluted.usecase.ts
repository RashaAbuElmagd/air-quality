import { Injectable } from '@nestjs/common';
import { AirQuality } from '../../domain/model/air-quality.model';
import { AirQualityRepository } from '../../infrastructure/repository/air-quality.repository';

@Injectable()
export class GetMostPollutedUseCase {
  constructor(private readonly airQualityRepository: AirQualityRepository) {}

  async execute(city: string): Promise<AirQuality | null> {
    return this.airQualityRepository.findMostPolluted(city);
  }
} 