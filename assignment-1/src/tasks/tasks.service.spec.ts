import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from '../entities/Task';
import { ClockService } from './clock.provider';

describe('TasksService', () => {
  let service: TasksService;
  let mockRepo: { count: jest.Mock };

  beforeEach(async () => {
    mockRepo = { count: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
        {
          provide: ClockService,
          useValue: { now: jest.fn().mockReturnValue(new Date('2026-01-01')) },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('returns the count from the repository', async () => {
    mockRepo.count.mockResolvedValue(7);

    const result = await service.countTasks();

    expect(result).toBe(7);
    expect(mockRepo.count).toHaveBeenCalledTimes(1);
  });

  it('returns the mocked time from the clock', () => {
    const result = service.lastCheckedAt();

    expect(result).toEqual(new Date('2026-01-01'));
  });
});
