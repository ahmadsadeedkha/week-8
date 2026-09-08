import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/Task';

@Controller('tasks')
export class TasksController {}
