import { Module } from '@nestjs/common';
import { CommentsModule } from '../comments/comments.module.js';
import { Task } from '../entities/Task.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CommentsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
