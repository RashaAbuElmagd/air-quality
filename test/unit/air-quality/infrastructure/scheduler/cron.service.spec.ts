import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CronService } from '../../../../../src/air-quality/infrastructure/scheduler/cron.service';
import { FetchAirQualityUseCase } from '../../../../../src/air-quality/application/usecase/fetch-air-quality.usecase';
import { SaveAirQualityUseCase } from '../../../../../src/air-quality/application/usecase/save-air-quality.usecase';
import { AirQuality, Pollution, Weather } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';

describe('CronService', () => {
  let service: CronService;
  let mockFetchAirQualityUseCase: jest.Mocked<FetchAirQualityUseCase>;
  let mockSaveAirQualityUseCase: jest.Mocked<SaveAirQualityUseCase>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Create mocks
    mockFetchAirQualityUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FetchAirQualityUseCase>;

    mockSaveAirQualityUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SaveAirQualityUseCase>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        { provide: FetchAirQualityUseCase, useValue: mockFetchAirQualityUseCase },
        { provide: SaveAirQualityUseCase, useValue: mockSaveAirQualityUseCase },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CronService>(CronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkParisAirQuality', () => {
    it('should fetch air quality for Paris coordinates', async () => {
      // Arrange
      const parisiLatitude = 48.856613;
      const parisLongitude = 2.352222;
      const mockAirQuality = createMockAirQuality();
      
      mockFetchAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);
      mockSaveAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);

      // Act
      await service.checkParisAirQuality();

      // Assert
      expect(mockFetchAirQualityUseCase.execute).toHaveBeenCalledWith(
        parisiLatitude,
        parisLongitude,
      );
    });

    it('should save fetched air quality data', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      
      mockFetchAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);
      mockSaveAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);

      // Act
      await service.checkParisAirQuality();

      // Assert
      expect(mockSaveAirQualityUseCase.execute).toHaveBeenCalledWith(mockAirQuality);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const error = new Error('API error');
      mockFetchAirQualityUseCase.execute.mockRejectedValue(error);
      
      // We need to spy on console.error to prevent it from polluting test output
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert - should not throw
      await expect(service.checkParisAirQuality()).resolves.not.toThrow();
      
      // Verify error was handled
      expect(mockSaveAirQualityUseCase.execute).not.toHaveBeenCalled();
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