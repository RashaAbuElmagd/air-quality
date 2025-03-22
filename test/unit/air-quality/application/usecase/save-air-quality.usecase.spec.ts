import { Test, TestingModule } from '@nestjs/testing';
import { SaveAirQualityUseCase } from '../../../../../src/air-quality/application/usecase/save-air-quality.usecase';
import { AirQualityRepository } from '../../../../../src/air-quality/infrastructure/repository/air-quality.repository';
import { AirQuality, Pollution, Weather } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';

describe('SaveAirQualityUseCase', () => {
  let usecase: SaveAirQualityUseCase;
  let mockAirQualityRepository: jest.Mocked<AirQualityRepository>;

  beforeEach(async () => {
    // Create mock for the AirQualityRepository
    mockAirQualityRepository = {
      save: jest.fn(),
      findMostPolluted: jest.fn(),
    } as unknown as jest.Mocked<AirQualityRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveAirQualityUseCase,
        { provide: AirQualityRepository, useValue: mockAirQualityRepository },
      ],
    }).compile();

    usecase = module.get<SaveAirQualityUseCase>(SaveAirQualityUseCase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call repository.save with the provided air quality data', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      mockAirQualityRepository.save.mockResolvedValue(mockAirQuality);

      // Act
      await usecase.execute(mockAirQuality);

      // Assert
      expect(mockAirQualityRepository.save).toHaveBeenCalledWith(mockAirQuality);
    });

    it('should return saved air quality data from repository', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const savedMockAirQuality = { ...mockAirQuality, id: 'saved-id' };
      mockAirQualityRepository.save.mockResolvedValue(savedMockAirQuality);

      // Act
      const result = await usecase.execute(mockAirQuality);

      // Assert
      expect(result).toEqual(savedMockAirQuality);
    });

    it('should throw an error when repository.save fails', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const error = new Error('Database error');
      mockAirQualityRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(mockAirQuality)).rejects.toThrow('Database error');
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
    null,
    'Paris',
    'Ile-de-France',
    'France',
    location,
    pollution,
    weather,
    now
  );
} 