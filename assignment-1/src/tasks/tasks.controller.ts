import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('health')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('db')
  async checkDb() {
    const count = await this.tasksService.countTasks();
    return { taskCount: count };
  }
}
