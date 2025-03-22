import { Injectable } from '@nestjs/common';
import { AirQualityRepositoryPort } from '../../application/port/air-quality-repository.port';
import { AirQuality } from '../../domain/model/air-quality.model';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AirQualityMapper } from '../mapper/air-quality.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class AirQualityRepository implements AirQualityRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AirQualityMapper,
  ) {}

  async save(airQuality: AirQuality): Promise<AirQuality> {
    const data = this.mapper.toEntity(airQuality);
    const savedEntity = await this.prisma.airQuality.create({
      data,
    });
    return this.mapper.toDomain(savedEntity);
  }

  async findMostPolluted(city: string): Promise<AirQuality | null> {
    const airQualities = await this.prisma.$queryRaw`
      SELECT * FROM "air_quality"
      WHERE city = ${city}
      ORDER BY cast(pollution->>'aqius' as integer) DESC
      LIMIT 1
    `;
    
    if (!airQualities || (Array.isArray(airQualities) && airQualities.length === 0)) {
      return null;
    }
    
    const mostPolluted = Array.isArray(airQualities) ? airQualities[0] : airQualities;
    
    return this.mapper.toDomain(mostPolluted);
  }
} 