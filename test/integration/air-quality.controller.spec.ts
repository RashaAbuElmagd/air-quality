import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AirQualityController } from '../../src/air-quality/api/controller/air-quality.controller';
import { FetchAirQualityUseCase } from '../../src/air-quality/application/usecase/fetch-air-quality.usecase';
import { GetMostPollutedUseCase } from '../../src/air-quality/application/usecase/get-most-polluted.usecase';
import { AirQuality, Pollution, Weather } from '../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../src/air-quality/domain/valueobject/location.vo';
import { AirQualityMapper } from '../../src/air-quality/infrastructure/mapper/air-quality.mapper';

describe('AirQualityController (Integration)', () => {
  let app: INestApplication;
  let mockFetchAirQualityUseCase: jest.Mocked<FetchAirQualityUseCase>;
  let mockGetMostPollutedUseCase: jest.Mocked<GetMostPollutedUseCase>;
  let mockAirQualityMapper: jest.Mocked<AirQualityMapper>;

  beforeEach(async () => {
    // Create mocks for the use cases
    mockFetchAirQualityUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FetchAirQualityUseCase>;

    mockGetMostPollutedUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetMostPollutedUseCase>;

    // Create a mock for AirQualityMapper
    mockAirQualityMapper = {
      toDomain: jest.fn(),
      toEntity: jest.fn(),
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<AirQualityMapper>;

    // Create a test module with just the controller and its direct dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        { provide: FetchAirQualityUseCase, useValue: mockFetchAirQualityUseCase },
        { provide: GetMostPollutedUseCase, useValue: mockGetMostPollutedUseCase },
        { provide: AirQualityMapper, useValue: mockAirQualityMapper },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /air-quality/nearest-city', () => {
    it('should return 200 and air quality data', async () => {
      const latitude = 48.856613;
      const longitude = 2.352222;
      const now = new Date();
      const mockAirQuality = createMockAirQuality();

      mockFetchAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);

      mockAirQualityMapper.toResponseDto.mockReturnValue({
        Result: {
          city: 'Paris',
          state: 'Ile-de-France',
          country: 'France',
          location: {
            latitude: 48.856613,
            longitude: 2.352222,
          },
          pollution: {
            timestamp: now,
            aqius: 42,
            mainus: 'p2',
            aqicn: 14,
            maincn: 'p2',
          },
          weather: {
            timestamp: now,
            temperature: 15,
            pressure: 1012,
            humidity: 65,
            windSpeed: 3.1,
            windDirection: 270,
          },
          createdAt: now,
        }
      });

      return request(app.getHttpServer())
        .get('/air-quality/nearest-city')
        .query({ latitude, longitude })
        .expect(200)
        .expect((res) => {
          expect(res.body.Result).toHaveProperty('city', 'Paris');
          expect(res.body.Result).toHaveProperty('state', 'Ile-de-France');
          expect(res.body.Result).toHaveProperty('country', 'France');
          expect(res.body.Result.pollution).toHaveProperty('aqius', 42);
        });
    });

    it('should return 400 for invalid latitude', async () => {
      return request(app.getHttpServer())
        .get('/air-quality/nearest-city')
        .query({ latitude: 'invalid', longitude: 2.352222 })
        .expect(400)
    });

    it('should return 400 for invalid longitude', async () => {
      return request(app.getHttpServer())
        .get('/air-quality/nearest-city')
        .query({ latitude: 48.856613, longitude: 'invalid' })
        .expect(400)
    });

    it('should return 400 for out of range latitude', async () => {
      return request(app.getHttpServer())
        .get('/air-quality/nearest-city')
        .query({ latitude: 100, longitude: 2.352222 })
        .expect(400)
    });
  });

  describe('GET /air-quality/most-polluted', () => {
    it('should return 200 and most polluted time data when data exists', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const now = new Date();

      mockGetMostPollutedUseCase.execute.mockResolvedValue(mockAirQuality);

      // We don't need to mock the mapper for this endpoint, as the controller directly transforms the data
      // The controller will return a MostPollutedResponseDto with datetime, aqius, and city

      // Act & Assert
      return request(app.getHttpServer())
        .get('/air-quality/most-polluted')
        .expect(200)
        .expect((res) => {
          expect(res.body.Result).toHaveProperty('datetime');
          expect(res.body.Result).toHaveProperty('aqius', 42);
          expect(res.body.Result).toHaveProperty('city', 'Paris');
        });
    });

    it('should return 200 with message when no data exists', async () => {
      // Arrange
      mockGetMostPollutedUseCase.execute.mockResolvedValue(null);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/air-quality/most-polluted')
        .expect(200)
        .expect((res) => {
          expect(res.body.Result).toEqual({});
        });
    });
  });
});

// Helper function to create mock AirQuality objects
function createMockAirQuality(): AirQuality {
  const now = new Date();
  const location = new Location(48.856613, 2.352222);

  const pollution = new Pollution(
    now,
    42,
    'p2',
    14,
    'p2'
  );

  const weather = new Weather(
    now,
    15,
    1012,
    65,
    3.1,
    270
  );

  return new AirQuality(
    'test-id',
    'Paris',
    'Ile-de-France',
    'France',
    location,
    pollution,
    weather,
    now
  );
} 