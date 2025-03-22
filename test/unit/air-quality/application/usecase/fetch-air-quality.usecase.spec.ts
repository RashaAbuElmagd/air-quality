import { Test, TestingModule } from '@nestjs/testing';
import { FetchAirQualityUseCase } from '../../../../../src/air-quality/application/usecase/fetch-air-quality.usecase';
import { IQAirApiClient } from '../../../../../src/air-quality/infrastructure/acl/iqair-api.client';
import { AirQuality, Pollution, Weather } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';

describe('FetchAirQualityUseCase', () => {
  let usecase: FetchAirQualityUseCase;
  let mockIQAirApiClient: jest.Mocked<IQAirApiClient>;

  beforeEach(async () => {
    // Create mock for the IQAirApiClient
    mockIQAirApiClient = {
      fetchAirQuality: jest.fn(),
    } as unknown as jest.Mocked<IQAirApiClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchAirQualityUseCase,
        { provide: IQAirApiClient, useValue: mockIQAirApiClient },
      ],
    }).compile();

    usecase = module.get<FetchAirQualityUseCase>(FetchAirQualityUseCase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call iqairApiClient with correct location', async () => {
      // Arrange
      const latitude = 48.856613;
      const longitude = 2.352222;
      const expectedLocation = new Location(latitude, longitude);
      const mockAirQuality = createMockAirQuality(expectedLocation);
      
      mockIQAirApiClient.fetchAirQuality.mockResolvedValue(mockAirQuality);

      // Act
      await usecase.execute(latitude, longitude);

      // Assert
      expect(mockIQAirApiClient.fetchAirQuality).toHaveBeenCalledWith(
        expect.objectContaining({
          latitude: expectedLocation.latitude,
          longitude: expectedLocation.longitude,
        }),
      );
    });

    it('should return air quality data from iqairApiClient', async () => {
      // Arrange
      const latitude = 48.856613;
      const longitude = 2.352222;
      const location = new Location(latitude, longitude);
      const mockAirQuality = createMockAirQuality(location);
      
      mockIQAirApiClient.fetchAirQuality.mockResolvedValue(mockAirQuality);

      // Act
      const result = await usecase.execute(latitude, longitude);

      // Assert
      expect(result).toEqual(mockAirQuality);
    });

    it('should throw an error when iqairApiClient fails', async () => {
      // Arrange
      const latitude = 48.856613;
      const longitude = 2.352222;
      const error = new Error('API error');
      
      mockIQAirApiClient.fetchAirQuality.mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(latitude, longitude)).rejects.toThrow('API error');
    });
  });
});

// Helper function to create mock AirQuality objects
function createMockAirQuality(location: Location): AirQuality {
  const now = new Date();
  
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