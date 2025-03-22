import { Test, TestingModule } from '@nestjs/testing';
import { GetMostPollutedUseCase } from '../../../../../src/air-quality/application/usecase/get-most-polluted.usecase';
import { AirQualityRepository } from '../../../../../src/air-quality/infrastructure/repository/air-quality.repository';
import { AirQuality, Pollution, Weather } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';

describe('GetMostPollutedUseCase', () => {
  let usecase: GetMostPollutedUseCase;
  let mockAirQualityRepository: jest.Mocked<AirQualityRepository>;

  beforeEach(async () => {
    // Create mock for the AirQualityRepository
    mockAirQualityRepository = {
      save: jest.fn(),
      findMostPolluted: jest.fn(),
    } as unknown as jest.Mocked<AirQualityRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMostPollutedUseCase,
        { provide: AirQualityRepository, useValue: mockAirQualityRepository },
      ],
    }).compile();

    usecase = module.get<GetMostPollutedUseCase>(GetMostPollutedUseCase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call repository.findMostPolluted with the provided city', async () => {
      // Arrange
      const city = 'Paris';
      mockAirQualityRepository.findMostPolluted.mockResolvedValue(null);

      // Act
      await usecase.execute(city);

      // Assert
      expect(mockAirQualityRepository.findMostPolluted).toHaveBeenCalledWith(city);
    });

    it('should return air quality data when repository returns data', async () => {
      // Arrange
      const city = 'Paris';
      const mockAirQuality = createMockAirQuality(city, 150); // High pollution level
      mockAirQualityRepository.findMostPolluted.mockResolvedValue(mockAirQuality);

      // Act
      const result = await usecase.execute(city);

      // Assert
      expect(result).toEqual(mockAirQuality);
    });

    it('should return null when repository finds no data', async () => {
      // Arrange
      const city = 'NonExistentCity';
      mockAirQualityRepository.findMostPolluted.mockResolvedValue(null);

      // Act
      const result = await usecase.execute(city);

      // Assert
      expect(result).toBeNull();
    });

    it('should throw an error when repository.findMostPolluted fails', async () => {
      // Arrange
      const city = 'Paris';
      const error = new Error('Database error');
      mockAirQualityRepository.findMostPolluted.mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(city)).rejects.toThrow('Database error');
    });
  });
});

// Helper function to create mock AirQuality objects
function createMockAirQuality(city: string, aqius: number): AirQuality {
  const now = new Date();
  const location = new Location(48.856613, 2.352222);
  
  const pollution = new Pollution(
    now,
    aqius,
    'p2',
    Math.floor(aqius / 3), // Approximate conversion
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
    'most-polluted-id',
    city,
    'Ile-de-France',
    'France',
    location,
    pollution,
    weather,
    now
  );
} 