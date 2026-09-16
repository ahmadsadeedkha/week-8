import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/Task';
import { ClockService } from './clock.provider';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly clock: ClockService,
  ) {}

  async countTasks(): Promise<number> {
    return this.taskRepo.count();
  }

  lastCheckedAt(): Date {
    return this.clock.now();
  }
}
