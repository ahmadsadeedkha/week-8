import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Get(':id/comments')
  findComments(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getComments(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.addComment(id, dto);
  }
}
