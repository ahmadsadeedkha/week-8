import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/Task.js';
import { Comment } from '../entities/Comment.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { CommentsService } from '../comments/comments.service.js';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly commentsService: CommentsService,
  ) {}

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: { project: true, assignee: true, tags: true },
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async getComments(taskId: number): Promise<Comment[]> {
    await this.findOne(taskId); // 404s if the task doesn't exist
    return this.commentsService.findAllForTask(taskId);
  }

  async addComment(taskId: number, dto: CreateCommentDto): Promise<Comment> {
    const task = await this.findOne(taskId); // 404s if the task doesn't exist
    return this.commentsService.createForTask(dto, task);
  }
}
