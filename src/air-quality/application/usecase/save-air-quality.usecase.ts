import { Injectable } from '@nestjs/common';
import { AirQuality } from '../../domain/model/air-quality.model';
import { AirQualityRepository } from '../../infrastructure/repository/air-quality.repository';

@Injectable()
export class SaveAirQualityUseCase {
  constructor(private readonly airQualityRepository: AirQualityRepository) {}

  async execute(airQuality: AirQuality): Promise<AirQuality> {
    return this.airQualityRepository.save(airQuality);
  }
} 