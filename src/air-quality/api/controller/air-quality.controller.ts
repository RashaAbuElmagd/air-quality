import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetAirQualityDto } from '../dto/get-air-quality.dto';
import { AirQualityResponseDto, MostPollutedResponseDto, NoDataResponseDto } from '../dto/air-quality-response.dto';
import { FetchAirQualityUseCase } from '../../application/usecase/fetch-air-quality.usecase';
import { GetMostPollutedUseCase } from '../../application/usecase/get-most-polluted.usecase';
import { AirQualityMapper } from '../../infrastructure/mapper/air-quality.mapper';

@ApiTags('air-quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(
    private readonly fetchAirQualityUseCase: FetchAirQualityUseCase,
    private readonly getMostPollutedUseCase: GetMostPollutedUseCase,
    private readonly mapper: AirQualityMapper,
  ) { }

  @Get('nearest-city')
  @ApiOperation({ summary: 'Get air quality for nearest city to coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Air quality data retrieved successfully',
    type: AirQualityResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  @ApiResponse({ status: 500, description: 'Server error or IQAir API error' })
  async getNearestCityAirQuality(
    @Query(new ValidationPipe({ transform: true })) query: GetAirQualityDto,
  ): Promise<AirQualityResponseDto> {
    const { latitude, longitude } = query;

    const airQuality = await this.fetchAirQualityUseCase.execute(latitude, longitude);

    return this.mapper.toResponseDto(airQuality);
  }

  @Get('most-polluted')
  @ApiOperation({ summary: 'Get the most polluted time for Paris' })
  @ApiResponse({
    status: 200,
    description: 'Most polluted time data retrieved successfully',
    type: MostPollutedResponseDto
  })
  @ApiResponse({
    status: 200,
    description: 'No pollution data available',
    type: NoDataResponseDto
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  async getMostPollutedTime(): Promise<MostPollutedResponseDto | NoDataResponseDto> {
    const mostPolluted = await this.getMostPollutedUseCase.execute('Paris');

    if (!mostPolluted) {
      return { Result: {} };
    }

    const { pollution, city } = mostPolluted;
    const { timestamp, aqius } = pollution;

    return {
      Result: {
        datetime: timestamp,
        aqius,
        city,
      }
    };
  }
} 