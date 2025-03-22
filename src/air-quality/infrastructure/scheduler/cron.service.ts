import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { FetchAirQualityUseCase } from '../../application/usecase/fetch-air-quality.usecase';
import { SaveAirQualityUseCase } from '../../application/usecase/save-air-quality.usecase';
import { Location } from '../../domain/valueobject/location.vo';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);
  
  // Paris coordinates
  private readonly PARIS_LATITUDE = 48.856613;
  private readonly PARIS_LONGITUDE = 2.352222;

  constructor(
    private readonly fetchAirQualityUseCase: FetchAirQualityUseCase,
    private readonly saveAirQualityUseCase: SaveAirQualityUseCase,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Air quality CRON service initialized');
  }

  @Cron('* * * * *') // Every minute
  async checkParisAirQuality() {
    this.logger.debug('Checking air quality for Paris...');
    
    try {
      // Fetch air quality for Paris
      const airQuality = await this.fetchAirQualityUseCase.execute(
        this.PARIS_LATITUDE,
        this.PARIS_LONGITUDE,
      );
      
      // Save the air quality data
      await this.saveAirQualityUseCase.execute(airQuality);
      
      this.logger.debug('Air quality data for Paris saved successfully');
    } catch (error) {
      // Only log errors in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(`Failed to check air quality for Paris: ${error.message}`);
      }
    }
  }
} 