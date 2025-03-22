import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// API Layer
import { AirQualityController } from './api/controller/air-quality.controller';

// Application Layer
import { FetchAirQualityUseCase } from './application/usecase/fetch-air-quality.usecase';
import { SaveAirQualityUseCase } from './application/usecase/save-air-quality.usecase';
import { GetMostPollutedUseCase } from './application/usecase/get-most-polluted.usecase';

// Infrastructure Layer
import { AirQualityRepository } from './infrastructure/repository/air-quality.repository';
import { IQAirApiClient } from './infrastructure/acl/iqair-api.client';
import { CronService } from './infrastructure/scheduler/cron.service';
import { AirQualityMapper } from './infrastructure/mapper/air-quality.mapper';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [AirQualityController],
  providers: [
    // Application Layer
    FetchAirQualityUseCase,
    SaveAirQualityUseCase,
    GetMostPollutedUseCase,
    
    // Infrastructure Layer
    AirQualityRepository,
    IQAirApiClient,
    CronService,
    AirQualityMapper,
  ],
  exports: [
    FetchAirQualityUseCase,
    SaveAirQualityUseCase,
    GetMostPollutedUseCase,
  ],
})
export class AirQualityModule {} 