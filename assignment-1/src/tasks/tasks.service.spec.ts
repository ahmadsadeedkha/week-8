import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from '../entities/Task';

describe('TasksService', () => {
  let service: TasksService;
  let mockRepo: { count: jest.Mock };

  beforeEach(async () => {
    mockRepo = { count: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
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
});
